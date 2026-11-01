import { In } from "typeorm";
import type {
  AddBodyMeasurementInput,
  BodyCompositionRecordInput,
  UpdateBodyMeasurementRecordInput,
} from "../Arguments/MeasurementArguments";
import BodyComposition from "../Model/BodyComposition";
import BodyMeasurement from "../Model/BodyMeasurement";
import type {
  BodyCompositionResponse,
  BodyMeasurementHistoryResponse,
  TrackingMutationResponse,
} from "../Response/ProfileResponse";
import { database } from "../database";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

class MeasurementValidationError extends Error {}

const trimToNull = (value?: string | null): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
};

const mergeText = (
  incoming: string | null | undefined,
  existing: string | null | undefined,
): string | null => (incoming === undefined ? existing ?? null : trimToNull(incoming));

const mergeRequiredText = (
  incoming: string | null | undefined,
  existing: string | null | undefined,
): string => mergeText(incoming, existing) ?? "";

const toNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const mergeNumber = (
  incoming: number | null | undefined,
  existing: string | number | null | undefined,
): number | null => (incoming === undefined ? toNumber(existing) : incoming);

const decimal = (value: number | null | undefined): string | null =>
  value === null || value === undefined ? null : String(value);

const isValidDate = (value: string): boolean => {
  if (!DATE_REGEX.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (year === undefined || month === undefined || day === undefined) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const todayString = (): string => {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const ensureMeasurementDate = (value: string | null): string => {
  if (!value || !isValidDate(value) || value > todayString()) {
    throw new MeasurementValidationError(
      "Measurement date must be valid and cannot be in the future",
    );
  }

  return value;
};

const ensurePositive = (
  value: number | null,
  label: string,
  max = Number.MAX_SAFE_INTEGER,
): number | null => {
  if (value !== null && (!Number.isFinite(value) || value <= 0 || value > max)) {
    throw new MeasurementValidationError(`${label} must be greater than 0`);
  }

  return value;
};

const ensurePercentage = (
  value: number | null,
  label: string,
): number | null => {
  if (value !== null && (!Number.isFinite(value) || value < 0 || value > 100)) {
    throw new MeasurementValidationError(`${label} must be between 0 and 100`);
  }

  return value;
};

const ensureOptionalInteger = (
  value: number | null,
  label: string,
  max: number,
): number | null => {
  if (
    value !== null &&
    (!Number.isInteger(value) || value <= 0 || value > max)
  ) {
    throw new MeasurementValidationError(`${label} must be a positive whole number`);
  }

  return value;
};

const compareLatestDate = (
  a: { measuredAt?: string | null; createdAt: Date },
  b: { measuredAt?: string | null; createdAt: Date },
): number => {
  const aDate = a.measuredAt ?? a.createdAt.toISOString().slice(0, 10);
  const bDate = b.measuredAt ?? b.createdAt.toISOString().slice(0, 10);

  return bDate.localeCompare(aDate) || b.createdAt.getTime() - a.createdAt.getTime();
};

const toBodyComposition = (
  composition: BodyComposition,
): BodyCompositionResponse => ({
  id: composition.id,
  bodyFatPercentage: toNumber(composition.bodyFatPercentage),
  fatMassKg: toNumber(composition.fatMassKg),
  muscleMassKg: toNumber(composition.muscleMassKg),
  skeletalMuscleMassKg: toNumber(composition.skeletalMuscleMassKg),
  leanBodyMassKg: toNumber(composition.leanBodyMassKg),
  bodyWaterPercentage: toNumber(composition.bodyWaterPercentage),
  totalBodyWaterLiters: toNumber(composition.totalBodyWaterLiters),
  visceralFat: composition.visceralFat ?? null,
  boneMassKg: toNumber(composition.boneMassKg),
  proteinPercentage: toNumber(composition.proteinPercentage),
  bmrKcal: composition.bmrKcal ?? null,
  bmi: toNumber(composition.bmi),
  metabolicAge: composition.metabolicAge ?? null,
  source: composition.source ?? null,
  measuredAt: composition.measuredAt ?? null,
});

const toMeasurement = (
  measurement: BodyMeasurement,
  composition: BodyComposition | null,
): BodyMeasurementHistoryResponse => ({
  id: measurement.id,
  weightKg: toNumber(measurement.weightKg),
  neckCm: toNumber(measurement.neckCm),
  shoulderCm: toNumber(measurement.shoulderCm),
  chestCm: toNumber(measurement.chestCm),
  bustCm: toNumber(measurement.bustCm),
  waistCm: toNumber(measurement.waistCm),
  abdomenCm: toNumber(measurement.abdomenCm),
  hipCm: toNumber(measurement.hipCm),
  leftArmCm: toNumber(measurement.leftArmCm),
  rightArmCm: toNumber(measurement.rightArmCm),
  leftThighCm: toNumber(measurement.leftThighCm),
  rightThighCm: toNumber(measurement.rightThighCm),
  leftCalfCm: toNumber(measurement.leftCalfCm),
  rightCalfCm: toNumber(measurement.rightCalfCm),
  heightCm: toNumber(measurement.heightCm),
  source: measurement.source ?? null,
  measuredAt: measurement.measuredAt ?? null,
  notes: measurement.notes ?? null,
  createdAt: measurement.createdAt,
  composition: composition ? toBodyComposition(composition) : null,
});

const hasCompositionValues = (
  input: BodyCompositionRecordInput | null | undefined,
): boolean => {
  if (!input) {
    return false;
  }

  return [
    input.bodyFatPercentage,
    input.fatMassKg,
    input.muscleMassKg,
    input.skeletalMuscleMassKg,
    input.leanBodyMassKg,
    input.bodyWaterPercentage,
    input.totalBodyWaterLiters,
    input.visceralFat,
    input.boneMassKg,
    input.proteinPercentage,
    input.bmrKcal,
    input.bmi,
    input.metabolicAge,
  ].some((value) => value !== null && value !== undefined);
};

export default class MeasurementService {
  async getHistory(
    authenticatedUserId: string | null | undefined,
    limit = 100,
  ): Promise<BodyMeasurementHistoryResponse[]> {
    const userId = this.requireUserId(authenticatedUserId);
    const records = await database.getRepository(BodyMeasurement).find({
      where: { userId },
    });
    const sorted = [...records].sort(compareLatestDate).slice(0, Math.max(1, Math.min(limit, 365)));
    const ids = sorted.map((record) => record.id);
    const compositions =
      ids.length === 0
        ? []
        : await database.getRepository(BodyComposition).find({
            where: { bodyMeasurementId: In(ids) },
          });
    const compositionsByMeasurement = new Map(
      compositions
        .filter((item): item is BodyComposition & { bodyMeasurementId: string } =>
          Boolean(item.bodyMeasurementId),
        )
        .map((item) => [item.bodyMeasurementId, item]),
    );

    return sorted.map((record) =>
      toMeasurement(record, compositionsByMeasurement.get(record.id) ?? null),
    );
  }

  async addMeasurement(
    authenticatedUserId: string | null | undefined,
    input: AddBodyMeasurementInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      return database.transaction(async (manager) => {
        const measuredAt = ensureMeasurementDate(input.measuredAt);
        const values = this.measurementValues(input, measuredAt, null);

        if (
          ![
            values.heightCm,
            values.weightKg,
            values.neckCm,
            values.shoulderCm,
            values.chestCm,
            values.bustCm,
            values.waistCm,
            values.abdomenCm,
            values.hipCm,
            values.leftArmCm,
            values.rightArmCm,
            values.leftThighCm,
            values.rightThighCm,
            values.leftCalfCm,
            values.rightCalfCm,
          ].some((value) => value !== null) &&
          !hasCompositionValues(input.composition)
        ) {
          throw new MeasurementValidationError(
            "Enter at least one measurement or body composition value",
          );
        }

        const repository = manager.getRepository(BodyMeasurement);
        const record = await repository.save(
          repository.create({ userId, ...values }),
        );

        await this.saveComposition(
          manager,
          userId,
          record.id,
          measuredAt,
          input.composition ?? null,
          null,
          values.source,
        );

        return { success: true, message: "Measurement saved", id: record.id };
      });
    });
  }

  async updateMeasurement(
    authenticatedUserId: string | null | undefined,
    id: string,
    input: UpdateBodyMeasurementRecordInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      return database.transaction(async (manager) => {
        const repository = manager.getRepository(BodyMeasurement);
        const existing = await this.findOwned(repository, id, userId);
        const measuredAt = ensureMeasurementDate(
          mergeRequiredText(input.measuredAt, existing.measuredAt),
        );
        const values = this.measurementValues(input, measuredAt, existing);

        Object.assign(existing, values);
        await repository.save(existing);

        if (input.composition !== undefined) {
          const compositionRepository = manager.getRepository(BodyComposition);
          const existingComposition = await compositionRepository.findOne({
            where: { bodyMeasurementId: existing.id },
          });

          await this.saveComposition(
            manager,
            userId,
            existing.id,
            measuredAt,
            input.composition,
            existingComposition,
            values.source,
          );
        }

        return { success: true, message: "Measurement updated", id };
      });
    });
  }

  async deleteMeasurement(
    authenticatedUserId: string | null | undefined,
    id: string,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      return database.transaction(async (manager) => {
        const repository = manager.getRepository(BodyMeasurement);
        const existing = await this.findOwned(repository, id, userId);

        await manager
          .getRepository(BodyComposition)
          .delete({ bodyMeasurementId: existing.id });
        await repository.remove(existing);

        return { success: true, message: "Measurement removed", id };
      });
    });
  }

  private requireUserId(userId: string | null | undefined): string {
    if (!userId || !UUID_REGEX.test(userId)) {
      throw new MeasurementValidationError("Authentication required");
    }

    return userId;
  }

  private async mutate(
    authenticatedUserId: string | null | undefined,
    operation: (userId: string) => Promise<TrackingMutationResponse>,
  ): Promise<TrackingMutationResponse> {
    try {
      return await operation(this.requireUserId(authenticatedUserId));
    } catch (error) {
      if (error instanceof MeasurementValidationError) {
        return { success: false, message: error.message };
      }

      console.error("Measurement operation failed:", error);

      return {
        success: false,
        message: "Unable to save your measurement. Please try again.",
      };
    }
  }

  private async findOwned(
    repository: { findOne: (options: object) => Promise<BodyMeasurement | null> },
    id: string,
    userId: string,
  ): Promise<BodyMeasurement> {
    if (!UUID_REGEX.test(id)) {
      throw new MeasurementValidationError("Invalid measurement");
    }

    const record = await repository.findOne({ where: { id, userId } });

    if (!record) {
      throw new MeasurementValidationError("Measurement not found");
    }

    return record;
  }

  private measurementValues(
    input: AddBodyMeasurementInput | UpdateBodyMeasurementRecordInput,
    measuredAt: string,
    existing: BodyMeasurement | null,
  ) {
    const source = trimToNull(
      mergeText(input.source, existing?.source),
    );

    if (source && source.length > 80) {
      throw new MeasurementValidationError(
        "Source must be 80 characters or fewer",
      );
    }

    const notes = trimToNull(mergeText(input.notes, existing?.notes));

    if (notes && notes.length > 2000) {
      throw new MeasurementValidationError(
        "Notes must be 2000 characters or fewer",
      );
    }

    return {
      heightCm: decimal(
        ensurePositive(
          mergeNumber(input.heightCm, existing?.heightCm),
          "Height",
          300,
        ),
      ),
      weightKg: decimal(
        ensurePositive(
          mergeNumber(input.weightKg, existing?.weightKg),
          "Weight",
          1000,
        ),
      ),
      neckCm: decimal(
        ensurePositive(
          mergeNumber(input.neckCm, existing?.neckCm),
          "Neck",
          300,
        ),
      ),
      shoulderCm: decimal(
        ensurePositive(
          mergeNumber(input.shoulderCm, existing?.shoulderCm),
          "Shoulder",
          300,
        ),
      ),
      chestCm: decimal(
        ensurePositive(
          mergeNumber(input.chestCm, existing?.chestCm),
          "Chest",
          300,
        ),
      ),
      bustCm: decimal(
        ensurePositive(mergeNumber(input.bustCm, existing?.bustCm), "Bust", 300),
      ),
      waistCm: decimal(
        ensurePositive(
          mergeNumber(input.waistCm, existing?.waistCm),
          "Waist",
          300,
        ),
      ),
      abdomenCm: decimal(
        ensurePositive(
          mergeNumber(input.abdomenCm, existing?.abdomenCm),
          "Abdomen",
          300,
        ),
      ),
      hipCm: decimal(
        ensurePositive(mergeNumber(input.hipCm, existing?.hipCm), "Hip", 300),
      ),
      leftArmCm: decimal(
        ensurePositive(
          mergeNumber(input.leftArmCm, existing?.leftArmCm),
          "Left arm",
          300,
        ),
      ),
      rightArmCm: decimal(
        ensurePositive(
          mergeNumber(input.rightArmCm, existing?.rightArmCm),
          "Right arm",
          300,
        ),
      ),
      leftThighCm: decimal(
        ensurePositive(
          mergeNumber(input.leftThighCm, existing?.leftThighCm),
          "Left thigh",
          300,
        ),
      ),
      rightThighCm: decimal(
        ensurePositive(
          mergeNumber(input.rightThighCm, existing?.rightThighCm),
          "Right thigh",
          300,
        ),
      ),
      leftCalfCm: decimal(
        ensurePositive(
          mergeNumber(input.leftCalfCm, existing?.leftCalfCm),
          "Left calf",
          300,
        ),
      ),
      rightCalfCm: decimal(
        ensurePositive(
          mergeNumber(input.rightCalfCm, existing?.rightCalfCm),
          "Right calf",
          300,
        ),
      ),
      measuredAt,
      source,
      notes,
    };
  }

  private async saveComposition(
    manager: import("typeorm").EntityManager,
    userId: string,
    measurementId: string,
    measuredAt: string,
    input: BodyCompositionRecordInput | null,
    existing: BodyComposition | null,
    measurementSource: string | null,
  ): Promise<void> {
    if (!input || !hasCompositionValues(input)) {
      return;
    }

    const bodyFatPercentage = ensurePercentage(
      mergeNumber(input.bodyFatPercentage, existing?.bodyFatPercentage),
      "Body fat percentage",
    );
    const bodyWaterPercentage = ensurePercentage(
      mergeNumber(input.bodyWaterPercentage, existing?.bodyWaterPercentage),
      "Body water percentage",
    );
    const proteinPercentage = ensurePercentage(
      mergeNumber(input.proteinPercentage, existing?.proteinPercentage),
      "Protein percentage",
    );
    const values = {
      userId,
      bodyMeasurementId: measurementId,
      bodyFatPercentage: decimal(bodyFatPercentage),
      fatMassKg: decimal(
        ensurePositive(
          mergeNumber(input.fatMassKg, existing?.fatMassKg),
          "Fat mass",
          1000,
        ),
      ),
      muscleMassKg: decimal(
        ensurePositive(
          mergeNumber(input.muscleMassKg, existing?.muscleMassKg),
          "Muscle mass",
          1000,
        ),
      ),
      skeletalMuscleMassKg: decimal(
        ensurePositive(
          mergeNumber(input.skeletalMuscleMassKg, existing?.skeletalMuscleMassKg),
          "Skeletal muscle mass",
          1000,
        ),
      ),
      leanBodyMassKg: decimal(
        ensurePositive(
          mergeNumber(input.leanBodyMassKg, existing?.leanBodyMassKg),
          "Lean body mass",
          1000,
        ),
      ),
      bodyWaterPercentage: decimal(bodyWaterPercentage),
      totalBodyWaterLiters: decimal(
        ensurePositive(
          mergeNumber(input.totalBodyWaterLiters, existing?.totalBodyWaterLiters),
          "Total body water",
          1000,
        ),
      ),
      visceralFat: ensureOptionalInteger(
        mergeNumber(input.visceralFat, existing?.visceralFat),
        "Visceral fat",
        1000,
      ),
      boneMassKg: decimal(
        ensurePositive(
          mergeNumber(input.boneMassKg, existing?.boneMassKg),
          "Bone mass",
          1000,
        ),
      ),
      proteinPercentage: decimal(proteinPercentage),
      bmrKcal: ensureOptionalInteger(
        mergeNumber(input.bmrKcal, existing?.bmrKcal),
        "BMR",
        100000,
      ),
      bmi: decimal(
        ensurePositive(mergeNumber(input.bmi, existing?.bmi), "BMI", 200),
      ),
      metabolicAge: ensureOptionalInteger(
        mergeNumber(input.metabolicAge, existing?.metabolicAge),
        "Metabolic age",
        150,
      ),
      source:
        trimToNull(mergeText(input.source, existing?.source)) ?? measurementSource,
      measuredAt,
    };
    const repository = manager.getRepository(BodyComposition);

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }
}
