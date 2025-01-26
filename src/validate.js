import { object, string, setLocale } from 'yup';
import i18next from 'i18next';

const validate = (url, list) => {
  setLocale({
    mixed: {
      notOneOf: i18next.t('errors.alreadyAdded'),
    },
    string: {
      url: i18next.t('errors.notValidUrl'),
    },
  });
  const schema = object({
    url: string()
      .notOneOf(list)
      .url(),
  });
  return schema.validate({ url });
};

export default validate;
