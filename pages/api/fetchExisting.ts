import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { identificationType, identificationNumber } = req.body;

  try {
    const response = await fetch('http://localhost:5000/Fetch-Patient-Data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identificationType, identificationNumber }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch patient data');
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
