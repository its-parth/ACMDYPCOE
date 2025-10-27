import React, { createContext, useState, useContext, useEffect } from 'react';

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
  
  // Replace or update the notifications section with API-backed implementation

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const TOKEN_KEY = 'acm_token';
  const USER_KEY = 'acm_user';

  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    setNotificationsError(null);
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load notifications');
      }
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchNotifications error:', err);
      setNotificationsError(err.message || 'Could not load notifications');
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNotification = async (notification) => {
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(notification)
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.message || 'Create notification failed');
      }
      await fetchNotifications();
      return await res.json();
    } catch (err) {
      console.error('addNotification error:', err);
      throw err;
    }
  };

  const updateNotification = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.message || 'Update notification failed');
      }
      await fetchNotifications();
      return await res.json();
    } catch (err) {
      console.error('updateNotification error:', err);
      throw err;
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.message || 'Delete notification failed');
      }
      await fetchNotifications();
      return true;
    } catch (err) {
      console.error('deleteNotification error:', err);
      throw err;
    }
  };

  const [currentMembers, setCurrentMembers] = useState([]);
  const [currentMembersCnt, setCurrentMembersCnt] = useState(0);

  useEffect(() => {
    const fetchCurrentMembersCount = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/members', {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          }
        });
        const data = await res.json();
        const currentYear = new Date().getFullYear();
        const currentMembers = data.filter(
          m => !(m.isPastMember || (m.enrollmentYear || m.year) < currentYear)
        );
        setCurrentMembersCnt(currentMembers.length);
      } catch (err) {
        console.error('Error fetching member count:', err);
      }
    };

    fetchCurrentMembersCount();
  }, []);

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

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  // load events from backend on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/events');
        if (!res.ok) throw new Error('Failed to load events');
        const events = await res.json();
        const today = new Date();
        const up = [];
        const past = [];
        events.forEach(ev => {
          const evDate = new Date(ev.date);
          if (evDate >= new Date(today.toDateString())) up.push(ev);
          else past.push(ev);
        });


        setUpcomingEvents(up);
        setPastEvents(past);
      } catch (err) {
        console.error('loadEvents error:', err);
      }
    };
    loadEvents();
  }, []);

  // Event CRUD backed by API
  const addEvent = async (event) => {
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      if (!res.ok) throw new Error('Create event failed');
      const created = await res.json();
      const eventDate = new Date(created.date);
      const today = new Date();
      if (eventDate >= new Date(today.toDateString())) {
        setUpcomingEvents(prev => [...prev, created]);
      } else {
        setPastEvents(prev => [...prev, created]);
      }
      logActivity('Added Event', `Created event: ${created.title}`, 'event');
    } catch (err) {
      console.error('addEvent error:', err);
      alert('Failed to create event');
    }
  };

  const updateEvent = async (id, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error('Update event failed');
      const updated = await res.json();
      // update in upcoming/past arrays (id property provided by backend)
      setUpcomingEvents(prev => prev.map(e => (String(e.id) === String(id) ? updated : e)));
      setPastEvents(prev => prev.map(e => (String(e.id) === String(id) ? updated : e)));
      logActivity('Updated Event', `Updated event: ${updated.title}`, 'event');
    } catch (err) {
      console.error('updateEvent error:', err);
      alert('Failed to update event');
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete event failed');
      setUpcomingEvents(prev => prev.filter(e => String(e.id) !== String(id)));
      setPastEvents(prev => prev.filter(e => String(e.id) !== String(id)));
      logActivity('Deleted Event', `Deleted event id: ${id}`, 'event');
    } catch (err) {
      console.error('deleteEvent error:', err);
      alert('Failed to delete event');
    }
  };

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

  // Restore user from localStorage on load
  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
      if (token && user) {
        setCurrentUser(user);
      }
    } catch (err) {
      console.warn('Failed to restore auth from storage', err);
    }
  }, []); 

  // Auth functions
  const login = async (email, password, role = 'member') => {
    try {
      console.log('Logging in with', email, password, role);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      console.log("data: ", data);
      if (!res.ok) {
        return { ok: false, error: data.error || 'Login failed' };
      }

      const token = data.token;
      // backend returns role and name in your auth route — store a minimal user object
      const user = {
        id: data.id,
        name: data.name || email.split('@')[0],
        email,
        role: data.role || role,
        profilePhoto: data.profileImgUrl || '',
        position: data.position || '',
        memberId: data.MemberId || '',
        year: data.year || ''
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setCurrentUser(user);

      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
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
    const updatedUser = {
      ...currentUser,
      ...updatedData,
      profilePhoto: updatedData.profileImgUrl,
    }
    setCurrentUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const value = {
    currentUser,
    login,
    logout,
    updateCurrentUser,
    notifications,
    notificationsLoading,
    notificationsError,
    fetchNotifications,
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
    activityLogs,
    currentMembersCnt,
    setCurrentMembersCnt,
    getAuthHeaders, // exposed for future API calls
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
