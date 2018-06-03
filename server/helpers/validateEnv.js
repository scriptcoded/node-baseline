const fs = require('fs')
const path = require('path')
const readline = require('readline')

/**
 * Validates the .env file and checks it against .env.example
 *
 * @param {*} envPath Path to the .env file
 * @param {*} examplePath Path to the .env.example file
 */
module.exports.validateEnvFile = (envPath, examplePath) => {
  return new Promise((resolve, reject) => {
    let requiredKeys = []
    /**
     * Variables already in environment
     */
    let foundKeys = new Set(Object.keys(process.env))

    /**
     * Create reader for the example file
     */
    let exampleReader = readline.createInterface({
      input: fs.createReadStream(examplePath)
    })

    /**
     * Load .env.example lines into requiredKeys
     */
    exampleReader.on('line', line => {
      if (line.trim()[0] === '#') {
        return
      }

      let key = line.split('=')[0]

      if (key) {
        requiredKeys.push(key)
      }
    })

    /**
     * When finished, check .env file
     */
    exampleReader.on('close', () => {
      let envReader = readline.createInterface({
        input: fs.createReadStream(envPath)
      })

      /**
       * Load .env lines into foundKeys
       */
      envReader.on('line', line => {
        let parts = line.split('=')

        if (!parts[1]) {
          return
        }

        if (parts[0]) {
          foundKeys.add(parts[0])
        }
      })

      /**
       * When finished, make sure that all required keys were found
       */
      envReader.on('close', () => {
        var missingKeys = requiredKeys.filter(item => {
          return !foundKeys.has(item)
        })

        /**
         * If not all required keys found, throw an error
         */
        if (missingKeys.length) {
          return reject(new Error(`Missing variables in .env: '${missingKeys.join("', '")}'`))
        }

        resolve()
      })
    })
  })
}

/**
 * Shorthand for validating env files. Also makes
 * sure that .env and .env.example exists.
 */
module.exports.validateEnv = () => {
  let envPath = path.resolve('./.env')
  let examplePath = path.resolve('./.env.example')

  let hasEnv = fs.existsSync(envPath)
  let hasExample = fs.existsSync(examplePath)

  if ((process.env.NODE_ENV || '').trim() !== 'production' && !hasEnv) {
    throw new Error('Missing .env file')
  }

  if (hasExample) {
    module.exports.validateEnvFile(envPath, examplePath).catch(err => {
      console.error(err)
      throw err
    })
  } else {
    let errorMessage = 'Missing .env.example file. Skipping .env check.'
    let stars = Array(errorMessage.length + 3).join('*')
    process.emitWarning(`\n\n\x1b[31m${stars}\n ${errorMessage} \n${stars}\n\x1b[0m`)
  }
}
