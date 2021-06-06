import { TIMEOUT_SECS } from './config.js';

const timeout = s =>
  new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(new Error(`Request took too long! Timeout after ${s} seconds`)),
      s * 1000
    )
  );

export const getJSON = async url => {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} - (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
