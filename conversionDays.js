const dayMappings = {
    'Mon': 'Mon/Wed',
    'Tue': 'Tue/Thu',
    'Wed': 'Mon/Wed',
    'Thu': 'Tue/Thu',
    'Fri': 'Fri/Sat',
    'Sat': 'Sri/Sat',
    'Sun': 'Sun', // Add mappings for Sunday if needed
  };
  
  function mapDayToDBFormat(dateQueryParam) {
    // Convert the date parameter to a JavaScript Date object
    const selectedDate = new Date(dateQueryParam);
  
    // Options to get the abbreviated day name
    const options = { weekday: 'short' };
  
    // Use toLocaleDateString to get the abbreviated day name
    const dayAbbreviation = selectedDate.toLocaleDateString('en-US', options);
  
    // Use the abbreviation to get the corresponding value from the mapping
    const dbFormatDay = dayMappings[dayAbbreviation] || '';
  
    return dbFormatDay;
  }

  module.exports = mapDayToDBFormat;