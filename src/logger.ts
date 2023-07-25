import { pino } from "pino"
export const logger = pino(pino.destination({
  dest: `./uws-${new Date().toISOString().slice(0,10)}`, // omit for stdout
  minLength: 4096, // Buffer before writing
  sync: false // Asynchronous logging
}))