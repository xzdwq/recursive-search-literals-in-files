import axios from 'axios';
import chalk from 'chalk';
import config from '../config.js';

const { log } = console;

export const translate = async (text) => {
  let translateResult = '';

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.translate.apiSecretKey}`,
    },
  };
  if (config.translate.reqTimeoutMs) axiosConfig.timeout = config.translate.reqTimeoutMs;

  try {
    const response = await axios.post(
      config.translate.url,
      {
        model: 'text-davinci-002',
        messages: [
          {
            role: 'system',
            content: 'Вы переводите следующий текст с русского на английский:',
          },
          {
            role: 'user',
            content: text,
          },
        ],
      },
      axiosConfig
    );
    translateResult = response.data.choices[0].message.content;
  } catch (e) {
    log(chalk.red('Translate error: '), e.toString(), e?.response?.statusText || '');
  }
  return translateResult;
};
