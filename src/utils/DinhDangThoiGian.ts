function dinhDangThoiGian(thoigian: string) {
  const fixedTime = thoigian.replace(/\.(\d{3})\d+Z$/, ".$1Z");

  const date = new Date(fixedTime);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return date.toLocaleString("vi-VN", options);
}

export default dinhDangThoiGian;
