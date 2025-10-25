import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Mock initial data
  const [currentUser, setCurrentUser] = useState(null);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to ACM Club',
      description: 'Join us for exciting tech events and workshops throughout the semester!',
      date: '2025-10-20',
      image: null
    },
    {
      id: 2,
      title: 'Hackathon 2025',
      description: 'Register now for our annual hackathon. Amazing prizes and learning opportunities await!',
      date: '2025-10-22',
      image: null
    }
  ]);

  const [currentMembers, setCurrentMembers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'President',
      profilePhoto: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0066cc&color=fff&size=200',
      email: 'sarah.j@acm.org',
      membershipId: 'ACM2025001',
      year: 2025
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Vice President',
      profilePhoto: 'https://ui-avatars.com/api/?name=Michael+Chen&background=00c896&color=fff&size=200',
      email: 'michael.c@acm.org',
      membershipId: 'ACM2025002',
      year: 2025
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'Secretary',
      profilePhoto: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ff6b6b&color=fff&size=200',
      email: 'emily.r@acm.org',
      membershipId: 'ACM2025003',
      year: 2025
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Treasurer',
      profilePhoto: 'https://ui-avatars.com/api/?name=David+Kim&background=9b59b6&color=fff&size=200',
      email: 'david.k@acm.org',
      membershipId: 'ACM2025004',
      year: 2025
    },
    {
      id: 5,
      name: 'Priya Patel',
      position: 'Technical Lead',
      profilePhoto: 'https://ui-avatars.com/api/?name=Priya+Patel&background=f39c12&color=fff&size=200',
      email: 'priya.p@acm.org',
      membershipId: 'ACM2025005',
      year: 2025
    },
    {
      id: 6,
      name: 'James Wilson',
      position: 'Volunteer',
      profilePhoto: 'https://ui-avatars.com/api/?name=James+Wilson&background=3498db&color=fff&size=200',
      email: 'james.w@acm.org',
      membershipId: 'ACM2025006',
      year: 2025
    }
  ]);

  const [pastMembers, setPastMembers] = useState([
    {
      id: 101,
      name: 'Alex Thompson',
      position: 'President',
      profilePhoto: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=2c3e50&color=fff&size=200',
      email: 'alex.t@acm.org',
      membershipId: 'ACM2024001',
      year: 2024
    },
    {
      id: 102,
      name: 'Jessica Lee',
      position: 'Vice President',
      profilePhoto: 'https://ui-avatars.com/api/?name=Jessica+Lee&background=16a085&color=fff&size=200',
      email: 'jessica.l@acm.org',
      membershipId: 'ACM2024002',
      year: 2024
    },
    {
      id: 103,
      name: 'Ryan Martinez',
      position: 'Secretary',
      profilePhoto: 'https://ui-avatars.com/api/?name=Ryan+Martinez&background=e74c3c&color=fff&size=200',
      email: 'ryan.m@acm.org',
      membershipId: 'ACM2024003',
      year: 2024
    },
    {
      id: 201,
      name: 'Amanda Brown',
      position: 'President',
      profilePhoto: 'https://ui-avatars.com/api/?name=Amanda+Brown&background=8e44ad&color=fff&size=200',
      email: 'amanda.b@acm.org',
      membershipId: 'ACM2023001',
      year: 2023
    },
    {
      id: 202,
      name: 'Kevin Zhang',
      position: 'Technical Lead',
      profilePhoto: 'https://ui-avatars.com/api/?name=Kevin+Zhang&background=d35400&color=fff&size=200',
      email: 'kevin.z@acm.org',
      membershipId: 'ACM2023002',
      year: 2023
    }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: 'Web Development Workshop',
      description: 'Learn React.js and build modern web applications with hands-on projects.',
      date: '2025-11-05',
      time: '14:00',
      poster: 'https://via.placeholder.com/400x250/0066cc/ffffff?text=Web+Dev+Workshop',
      venue: 'Computer Lab A'
    },
    {
      id: 2,
      title: 'AI/ML Seminar',
      description: 'Introduction to Machine Learning and its real-world applications.',
      date: '2025-11-12',
      time: '15:30',
      poster: 'https://via.placeholder.com/400x250/00c896/ffffff?text=AI+ML+Seminar',
      venue: 'Auditorium'
    },
    {
      id: 3,
      title: 'Coding Competition',
      description: 'Test your coding skills in this competitive programming contest.',
      date: '2025-11-20',
      time: '10:00',
      poster: 'https://via.placeholder.com/400x250/ff6b6b/ffffff?text=Coding+Competition',
      venue: 'Online'
    }
  ]);

  const [pastEvents, setPastEvents] = useState([
    {
      id: 101,
      title: 'Hackathon 2024',
      description: 'A 24-hour coding marathon with 150+ participants building innovative solutions.',
      date: '2024-09-15',
      photos: [
        'https://via.placeholder.com/300x200/0066cc/ffffff?text=Hackathon+1',
        'https://via.placeholder.com/300x200/00c896/ffffff?text=Hackathon+2',
        'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Hackathon+3'
      ]
    },
    {
      id: 102,
      title: 'Python Workshop',
      description: 'Beginners workshop on Python programming fundamentals.',
      date: '2024-08-20',
      photos: [
        'https://via.placeholder.com/300x200/9b59b6/ffffff?text=Python+Workshop'
      ]
    },
    {
      id: 103,
      title: 'Tech Talk: Cloud Computing',
      description: 'Industry expert sharing insights on cloud technologies and DevOps.',
      date: '2024-07-10',
      photos: [
        'https://via.placeholder.com/300x200/f39c12/ffffff?text=Tech+Talk'
      ]
    }
  ]);

  // New: Feedback data
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      eventId: 101,
      eventTitle: 'Hackathon 2024',
      memberId: 1,
      memberName: 'Sarah Johnson',
      rating: 5,
      experience: 'excellent',
      comments: 'Amazing event! Learned a lot and made great connections.',
      improvements: 'Maybe extend it to 36 hours next time.',
      date: '2024-09-16'
    },
    {
      id: 2,
      eventId: 101,
      eventTitle: 'Hackathon 2024',
      memberId: 2,
      memberName: 'Michael Chen',
      rating: 4,
      experience: 'good',
      comments: 'Great organization and exciting challenges.',
      improvements: 'More food options would be nice.',
      date: '2024-09-16'
    },
    {
      id: 3,
      eventId: 102,
      eventTitle: 'Python Workshop',
      memberId: 3,
      memberName: 'Emily Rodriguez',
      rating: 5,
      experience: 'excellent',
      comments: 'Perfect for beginners! Instructor was very helpful.',
      improvements: 'None, it was perfect!',
      date: '2024-08-21'
    }
  ]);

  // New: Gallery items
  const [galleryItems, setGalleryItems] = useState([
    {
      id: 1,
      title: 'Hackathon 2024 Highlights',
      type: 'photo',
      url: 'https://via.placeholder.com/400x300/0066cc/ffffff?text=Hackathon+Winner',
      eventId: 101,
      eventTitle: 'Hackathon 2024',
      uploadedBy: 'Admin User',
      uploadDate: '2024-09-16',
      description: 'Winning team presentation'
    },
    {
      id: 2,
      title: 'Python Workshop Session',
      type: 'photo',
      url: 'https://via.placeholder.com/400x300/9b59b6/ffffff?text=Workshop+Coding',
      eventId: 102,
      eventTitle: 'Python Workshop',
      uploadedBy: 'Admin User',
      uploadDate: '2024-08-21',
      description: 'Students learning Python basics'
    },
    {
      id: 3,
      title: 'Tech Talk Keynote',
      type: 'video',
      url: 'https://via.placeholder.com/400x300/f39c12/ffffff?text=Video+Thumbnail',
      eventId: 103,
      eventTitle: 'Tech Talk: Cloud Computing',
      uploadedBy: 'Admin User',
      uploadDate: '2024-07-11',
      description: 'Industry expert keynote speech'
    }
  ]);

  // New: Activity logs
  const [activityLogs, setActivityLogs] = useState([
    {
      id: 1,
      action: 'Added Member',
      details: 'Added new member: Sarah Johnson',
      performedBy: 'Admin User',
      timestamp: '2025-01-15T10:30:00',
      category: 'member'
    },
    {
      id: 2,
      action: 'Created Event',
      details: 'Created event: Web Development Workshop',
      performedBy: 'Admin User',
      timestamp: '2025-01-10T14:20:00',
      category: 'event'
    },
    {
      id: 3,
      action: 'Sent Notification',
      details: 'Sent notification: Welcome to ACM Club',
      performedBy: 'Admin User',
      timestamp: '2025-01-05T09:15:00',
      category: 'notification'
    }
  ]);

  // Auth functions
  const login = (email, password, role) => {
    // Mock login - in real app, this would validate against backend
    if (role === 'admin') {
      setCurrentUser({
        id: 'admin',
        name: 'Admin User',
        email: email,
        role: 'admin',
        profilePhoto: 'https://ui-avatars.com/api/?name=Admin+User&background=0066cc&color=fff&size=200'
      });
      return true;
    } else {
      // Find member and login
      const member = currentMembers.find(m => m.email === email);
      if (member) {
        setCurrentUser({
          ...member,
          role: 'member'
        });
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Notification CRUD
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now()
    };
    setNotifications([newNotification, ...notifications]);
    logActivity('Sent Notification', `Sent notification: ${notification.title}`, 'notification');
  };

  const updateNotification = (id, updatedData) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, ...updatedData } : n
    ));
    logActivity('Updated Notification', `Updated notification: ${updatedData.title}`, 'notification');
  };

  const deleteNotification = (id) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(notifications.filter(n => n.id !== id));
    logActivity('Deleted Notification', `Deleted notification: ${notification?.title}`, 'notification');
  };

  // Member CRUD
  const addMember = (member) => {
    const newMember = {
      ...member,
      id: Date.now(),
      profilePhoto: member.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0066cc&color=fff&size=200`
    };
    setCurrentMembers([...currentMembers, newMember]);
    logActivity('Added Member', `Added new member: ${member.name}`, 'member');
  };

  const updateMember = (id, updatedData) => {
    setCurrentMembers(currentMembers.map(m => 
      m.id === id ? { ...m, ...updatedData } : m
    ));
    logActivity('Updated Member', `Updated member: ${updatedData.name}`, 'member');
  };

  const deleteMember = (id) => {
    const member = currentMembers.find(m => m.id === id);
    setCurrentMembers(currentMembers.filter(m => m.id !== id));
    logActivity('Deleted Member', `Deleted member: ${member?.name}`, 'member');
  };

  // Event CRUD
  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now()
    };
    const eventDate = new Date(event.date);
    const today = new Date();
    
    if (eventDate > today) {
      setUpcomingEvents([...upcomingEvents, newEvent]);
    } else {
      setPastEvents([newEvent, ...pastEvents]);
    }
    logActivity('Created Event', `Created event: ${event.title}`, 'event');
  };

  const updateEvent = (id, updatedData) => {
    setUpcomingEvents(upcomingEvents.map(e => 
      e.id === id ? { ...e, ...updatedData } : e
    ));
    setPastEvents(pastEvents.map(e => 
      e.id === id ? { ...e, ...updatedData } : e
    ));
    logActivity('Updated Event', `Updated event: ${updatedData.title}`, 'event');
  };

  const deleteEvent = (id) => {
    const upcomingEvent = upcomingEvents.find(e => e.id === id);
    const pastEvent = pastEvents.find(e => e.id === id);
    const eventTitle = upcomingEvent?.title || pastEvent?.title;
    
    setUpcomingEvents(upcomingEvents.filter(e => e.id !== id));
    setPastEvents(pastEvents.filter(e => e.id !== id));
    logActivity('Deleted Event', `Deleted event: ${eventTitle}`, 'event');
  };

  // New: Feedback CRUD
  const addFeedback = (feedback) => {
    const newFeedback = {
      ...feedback,
      id: Date.now(),
      memberId: currentUser.id,
      memberName: currentUser.name,
      date: new Date().toISOString().split('T')[0]
    };
    setFeedbacks([...feedbacks, newFeedback]);
  };

  const deleteFeedback = (id) => {
    setFeedbacks(feedbacks.filter(f => f.id !== id));
  };

  // New: Gallery CRUD
  const addGalleryItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      uploadedBy: currentUser.name,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setGalleryItems([newItem, ...galleryItems]);
    logActivity('Added Gallery Item', `Added ${item.type}: ${item.title}`, 'gallery');
  };

  const updateGalleryItem = (id, updatedData) => {
    setGalleryItems(galleryItems.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
    logActivity('Updated Gallery Item', `Updated gallery item: ${updatedData.title}`, 'gallery');
  };

  const deleteGalleryItem = (id) => {
    const item = galleryItems.find(g => g.id === id);
    setGalleryItems(galleryItems.filter(item => item.id !== id));
    logActivity('Deleted Gallery Item', `Deleted gallery item: ${item?.title}`, 'gallery');
  };

  // New: Activity log helper
  const logActivity = (action, details, category) => {
    const newLog = {
      id: Date.now(),
      action,
      details,
      performedBy: currentUser?.name || 'Admin User',
      timestamp: new Date().toISOString(),
      category
    };
    setActivityLogs([newLog, ...activityLogs]);
  };

  // Update current user profile
  const updateCurrentUser = (updatedData) => {
    setCurrentUser({
      ...currentUser,
      ...updatedData
    });
  };

  const value = {
    currentUser,
    login,
    logout,
    updateCurrentUser,
    notifications,
    addNotification,
    updateNotification,
    deleteNotification,
    currentMembers,
    pastMembers,
    addMember,
    updateMember,
    deleteMember,
    upcomingEvents,
    pastEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    feedbacks,
    addFeedback,
    deleteFeedback,
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    activityLogs
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
