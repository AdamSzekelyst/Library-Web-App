export type Book = {
  _id: any,
  title: string,
  author: string,
  category: string,
  loanedUntil?: Date,
  reservedBy?: string,
  reservationDate?: Date
}
