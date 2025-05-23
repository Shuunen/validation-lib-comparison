import { type input as InferInput, type infer as InferOutput, number, object, string } from 'zod4'
import { checkUserA, checkUserB, checkUserC, logExecTime, nbIterations } from './utils.ts'

const startTime = performance.now()

for (let i = 0; i < nbIterations; i++) {
  const userSchema = object({
    name: string(),
    age: number().default(42),
    phone: string()
      .or(number())
      .default('123-456-7890')
      .transform(phone => (typeof phone === 'number' ? phone.toString() : phone)),
  })

  // @ts-expect-error not exported, it's ok :p
  type User = InferOutput<typeof userSchema>

  type UserInput = InferInput<typeof userSchema>

  const userA = userSchema.parse({ name: 'Jordan' })
  checkUserA(userA)

  function createUser(input: UserInput) {
    const result = userSchema.safeParse(input)
    if (!result.success) return userA
    return result.data
  }

  const userB = createUser({ name: 'Romain', age: 35, phone: 1234567890 })
  checkUserB(userB)

  // @ts-expect-error age should be a number
  const userC = createUser({ name: 'Romain', age: '35' })
  checkUserC(userC)
}

logExecTime('Zod v4', startTime)
