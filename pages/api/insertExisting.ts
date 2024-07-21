import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    identificationNumber,
    firstName,
    lastName,
    preferredPronouns,
    chiefComplaints,
  } = req.body;

  // Ensure the required fields are provided
  if (!identificationNumber || !firstName || !lastName || !chiefComplaints) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const response = await fetch('http://localhost:5000/Insert-Registration-Data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identificationNumber,
        firstName,
        lastName,
        preferredPronouns,
        chiefComplaints,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error Response Text:", errorText); // Log error response text
      throw new Error('Failed to register patient');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error.message); // Log error message
    res.status(500).json({ message: error.message });
  }
}
