import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('nexthirebd');
    const usersCollection = db.collection('users');

    // Find the user
    const user = await usersCollection.findOne({ email, role });
    if (!user) {
      return NextResponse.json({ message: 'User not found or incorrect role' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }

    return NextResponse.json(
      { 
        message: 'Login successful', 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          profilePic: user.profilePic 
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
