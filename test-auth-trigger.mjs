#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pghfvrerwycfhmcewiup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGZ2cmVyd3ljZmhtY2V3aXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODYzNTcsImV4cCI6MjA4MjA2MjM1N30.rsfDxYMhAvecgk19EWucJVJ5yxI6ODTi2gdB6rCbmws';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 Testing Auth Profile Trigger\n');
console.log('=' .repeat(60));

async function testCoachAutoProfile() {
  console.log('\n📋 Test 1: Coach Profile Auto-Creation');
  console.log('-'.repeat(60));

  const email = `trigger-test-coach-${Date.now()}@test.com`;
  const password = 'TestPassword123!';

  try {
    // Sign up with coach metadata
    console.log('1. Signing up coach with metadata...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          role: 'coach',
          firstName: 'Trigger',
          lastName: 'Test',
          displayName: 'Trigger Test Coach',
          brandSlug: `trigger-coach-${Date.now()}`
        }
      }
    });

    if (signupError) {
      console.error('❌ Signup failed:', signupError.message);
      return false;
    }

    console.log('✅ User created:', signupData.user.id);

    // Wait a moment for trigger to execute
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if profile was automatically created
    console.log('2. Checking if profile was auto-created...');
    const { data: profile, error: profileError } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', signupData.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('❌ Profile check failed:', profileError.message);
      return false;
    }

    if (!profile) {
      console.error('❌ Profile was NOT automatically created!');
      console.error('   The trigger may not be working.');
      return false;
    }

    console.log('✅ Profile automatically created!');
    console.log('   ID:', profile.id);
    console.log('   Email:', profile.email);
    console.log('   Name:', profile.first_name, profile.last_name);
    console.log('   Display Name:', profile.display_name);
    console.log('   Brand Slug:', profile.brand_slug);

    return true;

  } catch (err) {
    console.error('❌ Test failed:', err.message);
    return false;
  }
}

async function testMemberAutoProfile() {
  console.log('\n📋 Test 2: Member Profile Auto-Creation');
  console.log('-'.repeat(60));

  const email = `trigger-test-member-${Date.now()}@test.com`;
  const password = 'TestPassword123!';

  try {
    // Get a coach to assign the member to
    console.log('1. Finding a coach for member assignment...');
    const { data: coach } = await supabase
      .from('coaches')
      .select('id, display_name')
      .limit(1)
      .maybeSingle();

    if (!coach) {
      console.warn('⚠️  No coach found. Skipping member test.');
      return null;
    }

    console.log('   Using coach:', coach.display_name);

    // Sign up with member metadata
    console.log('2. Signing up member with metadata...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          role: 'member',
          coach_id: coach.id,
          firstName: 'Trigger',
          lastName: 'Member'
        }
      }
    });

    if (signupError) {
      console.error('❌ Signup failed:', signupError.message);
      return false;
    }

    console.log('✅ User created:', signupData.user.id);

    // Wait a moment for trigger to execute
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if profile was automatically created
    console.log('3. Checking if profile was auto-created...');
    const { data: profile, error: profileError } = await supabase
      .from('members')
      .select('*, coaches(display_name)')
      .eq('id', signupData.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('❌ Profile check failed:', profileError.message);
      return false;
    }

    if (!profile) {
      console.error('❌ Profile was NOT automatically created!');
      console.error('   The trigger may not be working.');
      return false;
    }

    console.log('✅ Profile automatically created!');
    console.log('   ID:', profile.id);
    console.log('   Email:', profile.email);
    console.log('   Name:', profile.first_name, profile.last_name);
    console.log('   Coach:', profile.coaches?.display_name);
    console.log('   Status:', profile.status);

    return true;

  } catch (err) {
    console.error('❌ Test failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('\nThis test verifies that user profiles are automatically');
  console.log('created when users sign up through Supabase Auth.\n');

  const results = [];

  // Test coach auto-creation
  const coachResult = await testCoachAutoProfile();
  results.push({ test: 'Coach Auto-Profile', passed: coachResult });

  // Test member auto-creation
  const memberResult = await testMemberAutoProfile();
  if (memberResult !== null) {
    results.push({ test: 'Member Auto-Profile', passed: memberResult });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  results.forEach(r => {
    const icon = r.passed ? '✅' : '❌';
    console.log(`${icon} ${r.test}`);
  });

  console.log(`\nResult: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('\n🎉 SUCCESS! Auth trigger is working correctly!');
    console.log('   Profiles are being automatically created on signup.\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  FAILURE! Auth trigger may not be installed.');
    console.log('   Please apply the migration: apply-auth-trigger.sql\n');
    process.exit(1);
  }
}

main();
