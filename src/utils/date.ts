import dayjs from "dayjs";

export const formatDate = (str: string) =>
  dayjs(str).format("YYYY-MM-DD HH:mm");
