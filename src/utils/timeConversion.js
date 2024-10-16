class TimeConversion {
  static unixTimeToRealTime(time) {
    const date = new Date(time * 1);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  static realTimeToUnixTime(realTime) {
    const parts = realTime.split(/[- :]/);

    // Default time variables
    let year, month, day, hours, minutes, seconds;

    // If time is not provided, set default values for hours, minutes, and seconds
    if (parts.length === 3) {
      // Format is YYYY-MM-DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      // Format is YYYY-MM-DD HH:MM:SS
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
      hours = parseInt(parts[3], 10) || 0;
      minutes = parseInt(parts[4], 10) || 0;
      seconds = parseInt(parts[5], 10) || 0;
    }

    // Create a new date object with the parsed values
    const date = new Date(year, month, day, hours, minutes, seconds);

    return date.getTime();
  }
}

export default TimeConversion;
