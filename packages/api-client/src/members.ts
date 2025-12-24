import { apiFetch } from "./http";
import type { Member } from "@moove/types";

const STORAGE_KEY = "moove_members_seed";

// Generate fake member data for dev fallback
function generateFakeMembers(): Member[] {
  const firstNames = ["Robert", "Jacob", "Ralph", "Darlene", "Floyd", "Jerome", "Robby", "Sarah", "Emily", "Michael", "Jessica", "David", "Amanda", "Christopher", "Ashley"];
  const lastNames = ["Fox", "Jones", "Edwards", "Robertson", "Miles", "Bell", "Williams", "Johnson", "Smith", "Brown", "Davis", "Wilson", "Moore", "Taylor", "Anderson"];
  const genders = ["Male", "Female", "Other"];
  const fitnessGoals = ["Be more active", "Lose weight", "Build muscle", "Improve flexibility", "Train for event"];
  const statuses: ("active" | "inactive")[] = ["active", "inactive"];

  const members: Member[] = [];

  for (let i = 0; i < 15; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const joinDaysAgo = Math.floor(Math.random() * 365) + 30;

    members.push({
      id: `member-${i + 1}`,
      coachId: "coach-1",
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      role: "member",
      dob: new Date(1985 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      gender: genders[Math.floor(Math.random() * genders.length)],
      fitnessGoal: fitnessGoals[Math.floor(Math.random() * fitnessGoals.length)],
      weightKg: Math.floor(Math.random() * 40) + 55,
      heightCm: Math.floor(Math.random() * 40) + 155,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastActivityAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      avatarUrl: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      createdAt: new Date(Date.now() - joinDaysAgo * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return members;
}

function getStoredMembers(): Member[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  // Initialize with fake data
  const fakeMembers = generateFakeMembers();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeMembers));
  return fakeMembers;
}

export interface ListMembersParams {
  search?: string;
  status?: "active" | "inactive" | "all";
}

export async function listMembers(params?: ListMembersParams): Promise<Member[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set("search", params.search);
    if (params?.status && params.status !== "all") queryParams.set("status", params.status);

    const query = queryParams.toString();
    const path = `/members${query ? `?${query}` : ""}`;

    // The API returns { status: "SUCCESS", members: Member[] }
    const response = await apiFetch<{ status: string; members: Member[] }>(path);
    return response.members || [];
  } catch (err) {
    console.warn("API unavailable, using localStorage fallback for members");
    // Fallback to localStorage
    let members = getStoredMembers();

    // Apply client-side filtering
    if (params?.search) {
      const search = params.search.toLowerCase();
      members = members.filter(m =>
        m.firstName?.toLowerCase().includes(search) ||
        m.lastName?.toLowerCase().includes(search) ||
        m.email?.toLowerCase().includes(search)
      );
    }

    if (params?.status && params.status !== "all") {
      members = members.filter(m => m.status === params.status);
    }

    return members;
  }
}

export async function getMember(memberId: string): Promise<Member | null> {
  try {
    // The API returns { status: "SUCCESS", member: Member }
    const response = await apiFetch<{ status: string; member: Member }>(`/members/${memberId}`);
    return response.member || null;
  } catch (err) {
    console.warn("API unavailable, using localStorage fallback for member");
    // Fallback to localStorage
    const members = getStoredMembers();
    return members.find(m => m.id === memberId) || null;
  }
}
