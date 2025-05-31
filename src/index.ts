import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Bitespeed backend is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.get('/test-db', async (req, res) => {
  const contacts = await prisma.contact.findMany();
  res.json(contacts);
});

app.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'Email or phone number required' });
  }

  try {
    // Step 1: Find all matching contacts
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { email: email ?? undefined },
          { phoneNumber: phoneNumber ?? undefined }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    // If no contact exists, create a new primary one
    if (contacts.length === 0) {
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'primary'
        }
      });

      return res.json({
        contact: {
          primaryContactId: newContact.id,
          emails: [email],
          phoneNumbers: [phoneNumber],
          secondaryContactIds: []
        }
      });
    }

    // Else - merge contacts & resolve primary/secondary
    const primaryContact = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];

    const secondaryContacts = contacts.filter(c => c.id !== primaryContact.id);

    const emails = Array.from(new Set(contacts.map(c => c.email).filter(Boolean)));
    const phoneNumbers = Array.from(new Set(contacts.map(c => c.phoneNumber).filter(Boolean)));
    const secondaryIds = secondaryContacts.map(c => c.id);

    // Create new contact if email/phone is new
    const exists = contacts.some(c => c.email === email || c.phoneNumber === phoneNumber);
    if (!exists) {
      const newSecondary = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'secondary',
          linkedId: primaryContact.id
        }
      });

      secondaryIds.push(newSecondary.id);
      if (!emails.includes(email)) emails.push(email);
      if (!phoneNumbers.includes(phoneNumber)) phoneNumbers.push(phoneNumber);
    }

    return res.json({
      contact: {
        primaryContactId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaryIds
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


