export function authorize(role) {
  return (req, res, next) => {
    let count = 0;
    while (!(role[count] === req.user.role)){
      if (!(role[count] === req.user.role)){ 
        if (count === role.length -1) {
          return res.status(403).json({ error: 'Acesso negado: permissão insuficiente' });
        }else{
          count++;
        }
      }
    }
    next();
  }
}
