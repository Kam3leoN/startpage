/** Anniversaire enregistré par l'utilisateur (jour/mois, année optionnelle). */
export interface BirthdayEntry {
  id: string;
  name: string;
  day: number;
  month: number;
  year?: number;
}
