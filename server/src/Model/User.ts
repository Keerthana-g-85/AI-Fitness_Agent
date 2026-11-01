import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import Allergy from "./Allergy";
import BodyComposition from "./BodyComposition";
import BodyMeasurement from "./BodyMeasurement";
import DataSharingConsent from "./DataSharingConsent";
import EatingHabit from "./EatingHabit";
import ExerciseRestriction from "./ExerciseRestriction";
import FoodIntake from "./FoodIntake";
import FitnessGoal from "./FitnessGoal";
import FoodAvailability from "./FoodAvailability";
import FoodPreference from "./FoodPreference";
import MedicalHistory from "./MedicalHistory";
import Medication from "./Medication";
import OnboardingSubmission from "./OnboardingSubmission";
import Personalization from "./Personalization";
import SleepRecord from "./SleepRecord";
import SportsActivity from "./SportsActivity";
import UserProfile from "./UserProfile";
import WorkLife from "./WorkLife";
import WorkoutPreference from "./WorkoutPreference";
import WaterIntake from "./WaterIntake";
import WorkoutSession from "./WorkoutSession";
import WorkoutSchedule from "./WorkoutSchedule";

@ObjectType()
@Entity("users")
export default class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 100, nullable: false })
  name!: string;

  @Field(() => String)
  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password!: string;

  @Field(() => Boolean)
  @Column({ name: "onboarding_completed", type: "boolean", nullable: false, default: false })
  onboardingCompleted = false;

  @Field(() => Date, { nullable: true })
  @Column({ name: "onboarding_completed_at", type: "timestamptz", nullable: true })
  onboardingCompletedAt?: Date | null;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile?: UserProfile;

  @OneToMany(() => FitnessGoal, (goal) => goal.user)
  fitnessGoals?: FitnessGoal[];

  @OneToMany(() => BodyMeasurement, (measurement) => measurement.user)
  bodyMeasurements?: BodyMeasurement[];

  @OneToMany(() => BodyComposition, (composition) => composition.user)
  bodyCompositions?: BodyComposition[];

  @OneToMany(() => MedicalHistory, (history) => history.user)
  medicalHistories?: MedicalHistory[];

  @OneToMany(() => Medication, (medication) => medication.user)
  medications?: Medication[];

  @OneToMany(() => Allergy, (allergy) => allergy.user)
  allergies?: Allergy[];

  @OneToOne(() => FoodPreference, (preference) => preference.user)
  foodPreferences?: FoodPreference;

  @OneToOne(() => EatingHabit, (habits) => habits.user)
  eatingHabits?: EatingHabit;

  @OneToOne(() => FoodAvailability, (availability) => availability.user)
  foodAvailability?: FoodAvailability;

  @OneToOne(() => WorkoutPreference, (preference) => preference.user)
  workoutPreferences?: WorkoutPreference;

  @OneToOne(() => WorkoutSchedule, (schedule) => schedule.user)
  workoutSchedule?: WorkoutSchedule;

  @OneToOne(() => ExerciseRestriction, (restriction) => restriction.user)
  exerciseRestrictions?: ExerciseRestriction;

  @OneToOne(() => WorkLife, (workLife) => workLife.user)
  workLife?: WorkLife;

  @OneToOne(() => Personalization, (personalization) => personalization.user)
  personalization?: Personalization;

  @OneToMany(() => DataSharingConsent, (consent) => consent.user)
  dataSharingConsents?: DataSharingConsent[];

  @OneToMany(() => OnboardingSubmission, (submission) => submission.user)
  onboardingSubmissions?: OnboardingSubmission[];

  @OneToMany(() => FoodIntake, (intake) => intake.user)
  foodIntakes?: FoodIntake[];

  @OneToMany(() => WaterIntake, (intake) => intake.user)
  waterIntakes?: WaterIntake[];

  @OneToMany(() => WorkoutSession, (session) => session.user)
  workoutSessions?: WorkoutSession[];

  @OneToMany(() => SleepRecord, (record) => record.user)
  sleepRecords?: SleepRecord[];

  @OneToMany(() => SportsActivity, (activity) => activity.user)
  sportsActivities?: SportsActivity[];
}
