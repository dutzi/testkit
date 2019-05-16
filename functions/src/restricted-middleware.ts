export default function(req: any, res: any, next: any) {
  if (req.query.idToken) {
    return next();
  } else {
    const err = new Error('Not authorized');
    return next(err);
  }
}
