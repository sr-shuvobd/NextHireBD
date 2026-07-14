import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { userId, name, email, profile } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('nexthirebd');
    const usersCollection = db.collection('users');

    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (profile) {
      // Set the profile subdocument
      updateFields.profile = profile;
      // Also sync profilePic field for compatibility
      if (profile.avatar) {
        updateFields.profilePic = profile.avatar;
      }
    }

    // Try finding by ObjectId or by string id
    let query: any = { _id: userId };
    try {
      query = { _id: new ObjectId(userId) };
    } catch (e) {
      query = { _id: userId };
    }

    const result = await usersCollection.findOneAndUpdate(
      query,
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      // Try fallback query by email
      if (email) {
        const fallbackResult = await usersCollection.findOneAndUpdate(
          { email },
          { $set: updateFields },
          { returnDocument: 'after' }
        );
        if (fallbackResult) {
          const userDoc = fallbackResult;
          return NextResponse.json({ 
            message: 'Profile updated successfully', 
            user: {
              id: userDoc._id.toString(),
              name: userDoc.name,
              email: userDoc.email,
              role: userDoc.role,
              profilePic: userDoc.profilePic || userDoc.profile?.avatar || '',
              profile: userDoc.profile || {}
            } 
          }, { status: 200 });
        }
      }
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userDoc = result;
    return NextResponse.json({ 
      message: 'Profile updated successfully', 
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        profilePic: userDoc.profilePic || userDoc.profile?.avatar || '',
        profile: userDoc.profile || {}
      } 
    }, { status: 200 });
  } catch (error) {
    console.error('Update Profile API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
