import { NextApiRequest, NextApiResponse } from 'next';
import checkScreenNameAvailability from '../../../utils/checkScreenNameAvailability';

type Data =
  | {
      screenName: string;
      available: boolean;
      reason?: string;
    }
  | {
      error: string;
    };

const apiCheckScreenNameAvailability = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  if (req.method !== 'GET') {
    res.status(404).json({ error: 'invalid request method' });
    return;
  }

  let screenName = req.query.screen_name;
  if (typeof screenName !== 'string') {
    res.status(400).json({ error: 'invalid query' });
    return;
  }

  try {
    screenName = await checkScreenNameAvailability(screenName);
  } catch (e) {
    res.status(400).json({ error: e.message });
    return;
  }

  res.status(200).json({ screenName, available: true });
};

export default apiCheckScreenNameAvailability;
