import jwt from 'jsonwebtoken'

export function authenticate(req, res, next) {
  const auth = req.headers.authorization || ''
  console.log('Authorization header recebido:', JSON.stringify(auth))

  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente ou mal formatado' })
  }

  const token = auth.slice(7).trim()
  console.log('Token extraído:', token)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Payload do token:', payload)
    req.user = payload
    next()
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return res.status(401).json({ error: 'Token inválido' })
  }
}
