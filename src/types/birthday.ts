/** Genre pour colorer le prénom (rose / bleu). */
export type BirthdayGender = "female" | "male";

/** Anniversaire enregistré par l'utilisateur (jour/mois, année et genre optionnels). */
export interface BirthdayEntry {
  id: string;
  name: string;
  day: number;
  month: number;
  year?: number;
  gender?: BirthdayGender;
}
