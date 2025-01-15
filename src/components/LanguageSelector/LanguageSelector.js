import React from 'react';
import Select from 'react-select';

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage, options }) => {
  return (
    <div>
      <label>Odaberite jezik:</label>
      <Select
        value={selectedLanguage}
        onChange={setSelectedLanguage}
        options={options}
      />
    </div>
  );
};

export default LanguageSelector;
