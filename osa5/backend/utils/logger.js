import { IS_TEST_ENV } from './config.js'
export const info = (...params) => {
  if (IS_TEST_ENV) {
    return
  }
  console.log(...params)

}

export const error = (...params) => {
  if (IS_TEST_ENV) {
    return
  }
  console.error(...params)
}