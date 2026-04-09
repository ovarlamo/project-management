import { globalSearch } from '../services/searchService.js';

export async function search(req, res, next) {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) return res.json({ success: true, data: { projects: [], tasks: [], users: [] } });

    const data = await globalSearch(query, req.user.isAdmin);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
