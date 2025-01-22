import { Request, Response } from 'express';
import OpenAI from 'openai';
import 'dotenv/config';
import Message, { IMessage } from '../models/Message';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: message,
        },
      ],
      store: true,
    });
    console.log(completion.choices[0].message);

    const generatedResponse = completion.choices[0].message.content;

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
