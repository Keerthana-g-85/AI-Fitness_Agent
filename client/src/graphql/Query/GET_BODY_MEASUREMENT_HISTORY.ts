import { gql } from "graphql-request";

export const GET_BODY_MEASUREMENT_HISTORY = gql`
  query GetBodyMeasurementHistory($limit: Int) {
    getBodyMeasurementHistory(limit: $limit) {
      id
      weightKg
      neckCm
      shoulderCm
      chestCm
      bustCm
      waistCm
      abdomenCm
      hipCm
      leftArmCm
      rightArmCm
      leftThighCm
      rightThighCm
      leftCalfCm
      rightCalfCm
      heightCm
      source
      measuredAt
      notes
      createdAt
      composition {
        id
        bodyFatPercentage
        fatMassKg
        muscleMassKg
        skeletalMuscleMassKg
        leanBodyMassKg
        bodyWaterPercentage
        totalBodyWaterLiters
        visceralFat
        boneMassKg
        proteinPercentage
        bmrKcal
        bmi
        metabolicAge
        source
        measuredAt
      }
    }
  }
`;
