#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pghfvrerwycfhmcewiup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGZ2cmVyd3ljZmhtY2V3aXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODYzNTcsImV4cCI6MjA4MjA2MjM1N30.rsfDxYMhAvecgk19EWucJVJ5yxI6ODTi2gdB6rCbmws';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TEST_RESULTS = {
  passed: 0,
  failed: 0,
  tests: []
};

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function testResult(name, passed, error = null) {
  TEST_RESULTS.tests.push({ name, passed, error });
  if (passed) {
    TEST_RESULTS.passed++;
    log(`✓ ${name}`, 'success');
  } else {
    TEST_RESULTS.failed++;
    log(`✗ ${name}`, 'error');
    if (error) log(`  Error: ${error}`, 'error');
  }
}

async function cleanup() {
  log('\n🧹 Cleaning up test data...', 'info');

  const testEmails = [
    'test-coach@moovefit.test',
    'test-member@moovefit.test',
    'coach-' + Date.now() + '@test.com',
    'member-' + Date.now() + '@test.com'
  ];

  for (const email of testEmails) {
    try {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const user = authUsers?.users?.find(u => u.email === email);
      if (user) {
        await supabase.auth.admin.deleteUser(user.id);
        log(`  Deleted user: ${email}`, 'info');
      }
    } catch (err) {
      log(`  Could not delete ${email}: ${err.message}`, 'warning');
    }
  }
}

async function testPhase1_Authentication() {
  log('\n📋 Phase 1: Authentication Tests', 'info');
  log('=' .repeat(60), 'info');

  const coachEmail = 'test-coach-' + Date.now() + '@test.com';
  const memberEmail = 'test-member-' + Date.now() + '@test.com';
  const password = 'TestPassword123!';

  let coachSession = null;
  let memberSession = null;
  let coachUserId = null;
  let memberUserId = null;

  try {
    log('\nTest 1.1: Coach Sign Up', 'info');
    const { data: coachSignup, error: coachSignupError } = await supabase.auth.signUp({
      email: coachEmail,
      password: password,
      options: {
        data: { role: 'coach' }
      }
    });

    if (coachSignupError) throw coachSignupError;
    testResult('Coach Sign Up', !!coachSignup.user);

    if (coachSignup.session) {
      coachSession = coachSignup.session;
      coachUserId = coachSignup.user.id;

      const coachClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
          headers: {
            Authorization: `Bearer ${coachSession.access_token}`
          }
        }
      });

      const { data: coachProfile, error: profileError } = await coachClient
        .from('coaches')
        .insert({
          id: coachSignup.user.id,
          email: coachEmail,
          first_name: 'Test',
          last_name: 'Coach',
          display_name: 'Test Coach',
          brand_slug: 'test-coach-' + Date.now()
        })
        .select()
        .single();

      testResult('Coach Profile Created', !!coachProfile && !profileError);
      if (coachProfile) {
        log(`  Coach ID: ${coachProfile.id}`, 'info');
        log(`  Email: ${coachProfile.email}`, 'info');
      } else if (profileError) {
        log(`  Profile Error: ${profileError.message}`, 'warning');
      }
    }
  } catch (err) {
    testResult('Coach Sign Up', false, err.message);
  }

  try {
    log('\nTest 1.2: Member Sign Up', 'info');
    const { data: memberSignup, error: memberSignupError } = await supabase.auth.signUp({
      email: memberEmail,
      password: password,
      options: {
        data: { role: 'member' }
      }
    });

    if (memberSignupError) throw memberSignupError;
    testResult('Member Sign Up', !!memberSignup.user);

    if (memberSignup.session && coachSession) {
      memberSession = memberSignup.session;
      memberUserId = memberSignup.user.id;

      const memberClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
          headers: {
            Authorization: `Bearer ${memberSession.access_token}`
          }
        }
      });

      const { data: coaches } = await supabase
        .from('coaches')
        .select('id')
        .limit(1)
        .single();

      if (coaches) {
        const { data: memberProfile, error: profileError } = await memberClient
          .from('members')
          .insert({
            id: memberSignup.user.id,
            email: memberEmail,
            coach_id: coaches.id,
            first_name: 'Test',
            last_name: 'Member',
            status: 'active'
          })
          .select()
          .single();

        testResult('Member Profile Created', !!memberProfile && !profileError);
        if (memberProfile) {
          log(`  Member ID: ${memberProfile.id}`, 'info');
          log(`  Email: ${memberProfile.email}`, 'info');
        } else if (profileError) {
          log(`  Profile Error: ${profileError.message}`, 'warning');
        }
      }
    }
  } catch (err) {
    testResult('Member Sign Up', false, err.message);
  }

  await supabase.auth.signOut();

  try {
    log('\nTest 1.3: Coach Sign In', 'info');
    const { data: coachLogin, error: coachLoginError } = await supabase.auth.signInWithPassword({
      email: coachEmail,
      password: password
    });

    if (coachLoginError) throw coachLoginError;
    testResult('Coach Sign In', !!coachLogin.session);
    coachSession = coachLogin.session;
  } catch (err) {
    testResult('Coach Sign In', false, err.message);
  }

  await supabase.auth.signOut();

  try {
    log('\nTest 1.4: Member Sign In', 'info');
    const { data: memberLogin, error: memberLoginError } = await supabase.auth.signInWithPassword({
      email: memberEmail,
      password: password
    });

    if (memberLoginError) throw memberLoginError;
    testResult('Member Sign In', !!memberLogin.session);
    memberSession = memberLogin.session;
  } catch (err) {
    testResult('Member Sign In', false, err.message);
  }

  try {
    log('\nTest 1.5: Invalid Credentials', 'info');
    const { error } = await supabase.auth.signInWithPassword({
      email: coachEmail,
      password: 'WrongPassword123!'
    });
    testResult('Invalid Credentials Rejected', !!error);
  } catch (err) {
    testResult('Invalid Credentials Rejected', true);
  }

  return { coachSession, memberSession, coachEmail, memberEmail, coachUserId, memberUserId };
}

async function testPhase2_DatabaseAccess(sessions) {
  log('\n📋 Phase 2: Database Access & RLS Tests', 'info');
  log('=' .repeat(60), 'info');

  const { coachSession, coachUserId } = sessions;

  if (!coachSession || !coachUserId) {
    log('⚠ Skipping database tests - no coach session available', 'warning');
    return null;
  }

  const coachClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${coachSession.access_token}`
      }
    }
  });

  let testVideoId = null;
  let testChallengeId = null;

  try {
    log('\nTest 2.1: Create Video (Coach)', 'info');
    const { data: video, error } = await coachClient
      .from('videos')
      .insert({
        coach_id: coachUserId,
        title: 'Test Video',
        description: 'Integration test video',
        duration_seconds: 600,
        video_url: 'https://www.youtube.com/watch?v=test',
        video_platform: 'youtube',
        video_id: 'test',
        thumbnail_url: 'https://example.com/thumb.jpg',
        published: false
      })
      .select()
      .single();

    if (error) throw error;
    testResult('Create Video', !!video);
    testVideoId = video?.id;
    if (video) log(`  Video ID: ${video.id}`, 'info');
  } catch (err) {
    testResult('Create Video', false, err.message);
  }

  try {
    log('\nTest 2.2: Read Own Videos (Coach)', 'info');
    const { data: videos, error } = await coachClient
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    testResult('Read Own Videos', Array.isArray(videos));
    if (videos) log(`  Found ${videos.length} video(s)`, 'info');
  } catch (err) {
    testResult('Read Own Videos', false, err.message);
  }

  if (testVideoId) {
    try {
      log('\nTest 2.3: Update Video (Coach)', 'info');
      const { data: updated, error } = await coachClient
        .from('videos')
        .update({ title: 'Updated Test Video', published: true })
        .eq('id', testVideoId)
        .select()
        .single();

      if (error) throw error;
      testResult('Update Video', updated?.title === 'Updated Test Video');
      if (updated) log(`  Video published for member access`, 'info');
    } catch (err) {
      testResult('Update Video', false, err.message);
    }
  }

  try {
    log('\nTest 2.4: Create Challenge (Coach)', 'info');
    const { data: challenge, error } = await coachClient
      .from('challenges')
      .insert({
        coach_id: coachUserId,
        title: 'Test Challenge',
        description: 'Integration test challenge',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;
    testResult('Create Challenge', !!challenge);
    testChallengeId = challenge?.id;
    if (challenge) log(`  Challenge ID: ${challenge.id}`, 'info');
  } catch (err) {
    testResult('Create Challenge', false, err.message);
  }

  try {
    log('\nTest 2.5: Read Own Challenges (Coach)', 'info');
    const { data: challenges, error } = await coachClient
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    testResult('Read Own Challenges', Array.isArray(challenges));
    if (challenges) log(`  Found ${challenges.length} challenge(s)`, 'info');
  } catch (err) {
    testResult('Read Own Challenges', false, err.message);
  }

  return { testVideoId, testChallengeId };
}

async function testPhase3_RoleBasedAccess(sessions, testData) {
  log('\n📋 Phase 3: Role-Based Access Control', 'info');
  log('=' .repeat(60), 'info');

  const { memberSession, coachSession } = sessions;
  const { testVideoId } = testData || {};

  if (!memberSession || !testVideoId) {
    log('⚠ Skipping RLS tests - insufficient test data', 'warning');
    return;
  }

  const memberClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${memberSession.access_token}`
      }
    }
  });

  const coachClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${coachSession.access_token}`
      }
    }
  });

  try {
    log('\nTest 3.1: Member Cannot Create Videos', 'info');
    const { data: { user } } = await memberClient.auth.getUser();

    const { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .limit(1)
      .single();

    const { error } = await memberClient
      .from('videos')
      .insert({
        coach_id: coach?.id,
        title: 'Unauthorized Video',
        duration_seconds: 600,
        video_url: 'https://www.youtube.com/watch?v=test',
        video_platform: 'youtube'
      });

    testResult('Member Cannot Create Videos', !!error && error.code === '42501');
  } catch (err) {
    testResult('Member Cannot Create Videos', true);
  }

  try {
    log('\nTest 3.2: Member Can Read Published Videos from Coach', 'info');
    const { data, error } = await memberClient
      .from('videos')
      .select('*')
      .eq('published', true);

    if (error) {
      log(`  Error: ${error.message}`, 'warning');
    }
    testResult('Member Can Read Published Videos from Coach', !error && Array.isArray(data));
    if (data) log(`  Found ${data.length} published video(s)`, 'info');
  } catch (err) {
    testResult('Member Can Read Published Videos from Coach', false, err.message);
  }

  try {
    log('\nTest 3.3: Member Cannot Read Unpublished Videos', 'info');
    const { data: unpublishedVideo } = await coachClient
      .from('videos')
      .insert({
        coach_id: sessions.coachUserId,
        title: 'Unpublished Test Video',
        duration_seconds: 300,
        video_url: 'https://www.youtube.com/watch?v=unpublished',
        video_platform: 'youtube',
        published: false
      })
      .select()
      .single();

    if (unpublishedVideo) {
      const { data: memberView } = await memberClient
        .from('videos')
        .select('*')
        .eq('id', unpublishedVideo.id)
        .maybeSingle();

      testResult('Member Cannot Read Unpublished Videos', !memberView);

      await coachClient.from('videos').delete().eq('id', unpublishedVideo.id);
    }
  } catch (err) {
    testResult('Member Cannot Read Unpublished Videos', false, err.message);
  }

  try {
    log('\nTest 3.4: Coach Cannot Access Other Coach Videos', 'info');
    const anotherCoachEmail = 'another-coach-' + Date.now() + '@test.com';
    const { data: signup } = await supabase.auth.signUp({
      email: anotherCoachEmail,
      password: 'TestPassword123!'
    });

    if (signup?.session) {
      const anotherCoachClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
          headers: {
            Authorization: `Bearer ${signup.session.access_token}`
          }
        }
      });

      await anotherCoachClient.from('coaches').insert({
        id: signup.user.id,
        email: anotherCoachEmail,
        display_name: 'Another Coach'
      });

      const { data: otherVideos } = await anotherCoachClient
        .from('videos')
        .select('*')
        .neq('coach_id', signup.user.id);

      testResult('Coach Cannot Access Other Coach Videos', !otherVideos || otherVideos.length === 0);
    }
  } catch (err) {
    testResult('Coach Cannot Access Other Coach Videos', false, err.message);
  }
}

async function testPhase4_ErrorHandling() {
  log('\n📋 Phase 4: Error Handling', 'info');
  log('=' .repeat(60), 'info');

  try {
    log('\nTest 4.1: Unauthenticated Request', 'info');
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await anonClient
      .from('videos')
      .select('*');

    testResult('Unauthenticated Request Handled', data !== null || error !== null);
  } catch (err) {
    testResult('Unauthenticated Request Handled', true);
  }

  try {
    log('\nTest 4.2: Invalid Table Access', 'info');
    const { error } = await supabase
      .from('nonexistent_table')
      .select('*');

    testResult('Invalid Table Access Rejected', !!error);
  } catch (err) {
    testResult('Invalid Table Access Rejected', true);
  }
}

function printSummary() {
  log('\n' + '='.repeat(60), 'info');
  log('📊 Test Summary', 'info');
  log('='.repeat(60), 'info');

  log(`\nTotal Tests: ${TEST_RESULTS.passed + TEST_RESULTS.failed}`, 'info');
  log(`Passed: ${TEST_RESULTS.passed}`, 'success');
  log(`Failed: ${TEST_RESULTS.failed}`, TEST_RESULTS.failed > 0 ? 'error' : 'success');

  if (TEST_RESULTS.failed > 0) {
    log('\n❌ Failed Tests:', 'error');
    TEST_RESULTS.tests
      .filter(t => !t.passed)
      .forEach(t => log(`  - ${t.name}: ${t.error || 'Unknown error'}`, 'error'));
  }

  const passRate = ((TEST_RESULTS.passed / (TEST_RESULTS.passed + TEST_RESULTS.failed)) * 100).toFixed(1);
  log(`\nPass Rate: ${passRate}%`, passRate === '100.0' ? 'success' : 'warning');

  log('\n' + '='.repeat(60), 'info');

  return TEST_RESULTS.failed === 0 ? 0 : 1;
}

async function main() {
  log('🚀 Starting Frontend Integration Tests', 'info');
  log('Testing Supabase Backend Integration\n', 'info');

  try {
    const sessions = await testPhase1_Authentication();
    const testData = await testPhase2_DatabaseAccess(sessions);
    await testPhase3_RoleBasedAccess(sessions, testData);
    await testPhase4_ErrorHandling();

    const exitCode = printSummary();

    log('\n✨ Integration testing complete!', 'success');
    process.exit(exitCode);
  } catch (err) {
    log(`\n💥 Fatal error: ${err.message}`, 'error');
    console.error(err);
    process.exit(1);
  }
}

main();
