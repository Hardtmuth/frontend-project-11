import { object, string, setLocale } from 'yup';

const validate = (url, state) => {
  const schema = object({
    url: string()
      .notOneOf(state.inputUrl.feeds)
      .url()
  });
  return schema.validate({ url });
};

export default validate;
