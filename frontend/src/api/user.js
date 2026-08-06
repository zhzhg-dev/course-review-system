function makeDemoProfile(email, fullName) {
  return {
    id: `demo-user-${email.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    fullName: fullName || email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
    email,
    phoneNumber: '',
    location: 'Auckland, New Zealand',
    bio: 'Portfolio demo profile',
    photo: ''
  };
}

export const register = async (data) => {
  return { data: makeDemoProfile(data.email, data.fullName) };
};

export const login = async (data) => {
  return { data: makeDemoProfile(data.email) };
};

