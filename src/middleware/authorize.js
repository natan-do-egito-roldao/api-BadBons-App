export function authorize(role) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    // caso seja uma role única (string)
    if (typeof role === 'string') {
      if (userRole !== role) {
        return res.status(403).json({ error: 'Acesso negado: permissão insuficiente' });
      }
      return next(); // <-- 'return' pra parar a função
    }

    // caso seja uma lista de roles permitidas
    if (Array.isArray(role)) {
      if (!role.includes(userRole)) {
        return res.status(403).json({ error: 'Acesso negado: permissão insuficiente' });
      }
      return next();
    }

    // se role não for string nem array
    return res.status(500).json({ error: 'Configuração inválida de autorização' });
  };
}
