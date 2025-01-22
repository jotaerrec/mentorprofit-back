import { Request, Response } from 'express';
import axios from 'axios';
import Message, { IMessage } from '../models/Message';

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { message } = req.body;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'] || 'unknown';

  if (!message) {
    res.status(400).send('Message is required.');
    return;
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: message,
        max_tokens: 100,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    const generatedResponse = response.data.choices[0].text.trim();

    const userHistory = await Message.findOneAndUpdate(
      { ip, userAgent },
      { $push: { messages: { text: message, response: generatedResponse } } },
      { new: true, upsert: true }
    );

    res.json(userHistory);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error communicating with OpenAI API.');
  }
};

export const getHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ip = req.ip;
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    const history = await Message.findOne({ ip, userAgent });
    if (!history) {
      res.status(404).send('No history found.');
      return;
    }
    res.json(history);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Database error.');
  }
};
