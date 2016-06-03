import { json, send } from 'micro';

export default async function (req, res) {
  const data = await json(req);
  console.log(data);
  send(res, 200);
}
