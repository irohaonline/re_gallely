import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AccountSettings.module.scss';
import Select from 'react-select';

const languageOptions = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

const LanguageSettings: FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (option) => {
    if (option.value !== i18n.language) {
      i18n.changeLanguage(option.value);
    }
  };

  return (
    <>
      <h2 className={styles.subHeading}>{t('personalSettings')}</h2>
      <div className={styles.row}>
        <label className={styles.label}>{t('language')}</label>
        <Select
          options={languageOptions}
          defaultValue={languageOptions.find((l) => l.value === i18n.language)}
          className={styles.selectLanguage}
          onChange={handleLanguageChange}
        />
      </div>
    </>
  );
};

export default LanguageSettings;
