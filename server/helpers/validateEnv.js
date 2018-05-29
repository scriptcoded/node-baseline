const fs = require('fs')
const path = require('path')
const readline = require('readline')

module.exports.validateEnvFile = (envPath, examplePath) => {
  return new Promise((resolve, reject) => {

    let requiredKeys = []
    let foundKeys = new Set(Object.keys(process.env))

    let exampleReader = readline.createInterface({
      input: fs.createReadStream(examplePath)
    })

    exampleReader.on('line', line => {
      let key = line.split('=')[0]

      if (key) {
        requiredKeys.push(key)
      }
    })

    exampleReader.on('close', () => {
      let envReader = readline.createInterface({
        input: fs.createReadStream(envPath)
      })
  
      envReader.on('line', line => {
        let parts = line.split('=')

        if (!parts[1]) {
          return
        }
  
        if (parts[0]) {
          foundKeys.add(parts[0])
        }
      })
  
      envReader.on('close', () => {
        
        var missingKeys = requiredKeys.filter(item => {
          return !foundKeys.has(item);
        })

        if (missingKeys.length) {
          return reject(new Error(`Missing variables in .env: '${missingKeys.join("', '")}'`))
        }

        resolve()
      })
    })
  })
}

module.exports.validateEnv = () => {
  let envPath = path.resolve('./.env')
  let examplePath = path.resolve('./.env.example')

  let hasEnv = fs.existsSync(envPath)
  let hasExample = fs.existsSync(examplePath)

  if ((process.env.NODE_ENV || '').trim() != 'production' && !hasEnv) {
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