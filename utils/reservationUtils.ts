import dayjs from "dayjs";

export const DATE_CHIP_COUNT = 14;

export const TIME_PICKER_SLOTS = Array.from({ length: 27 }, (_, i) => {
  const totalMinutes = 11 * 60 + i * 30;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

export const formatTime = (time: string): string => {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

export const formatDisplayDate = (iso: string): string => {
  const d = dayjs(iso);
  const today = dayjs();
  if (d.isSame(today, "day")) return `Today, ${d.format("D MMM")}`;
  if (d.isSame(today.add(1, "day"), "day"))
    return `Tomorrow, ${d.format("D MMM")}`;
  return d.format("ddd, D MMM");
};

export const formatPickerDate = (d: dayjs.Dayjs, index: number): string => {
  if (index === 0) return `Today, ${d.format("D MMM")}`;
  if (index === 1) return `Tomorrow, ${d.format("D MMM")}`;
  return d.format("ddd, D MMM");
};

export const makeDates = () =>
  Array.from({ length: DATE_CHIP_COUNT }, (_, i) => dayjs().add(i, "day"));
