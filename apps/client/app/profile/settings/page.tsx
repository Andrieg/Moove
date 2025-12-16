"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Title from "../../_components/atoms/Title";
import Text from "../../_components/atoms/Text";
import Button from "../../_components/atoms/Button";
import Image from "next/image";

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push("/profile")}
            className="mr-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Image src="/icons/back.svg" alt="Back" width={20} height={20} />
          </button>
          <Title size="xl" weight="700">Settings</Title>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Section */}
          <section>
            <Title size="base" weight="600" className="mb-4">Account</Title>
            <div className="bg-white rounded-lg shadow-sm">
              <button className="w-full px-4 py-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50">
                <Text size="base" weight="500">Edit Profile</Text>
                <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
              </button>
              <button className="w-full px-4 py-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50">
                <Text size="base" weight="500">Change Password</Text>
                <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
              </button>
              <button className="w-full px-4 py-4 flex justify-between items-center hover:bg-gray-50">
                <Text size="base" weight="500">Privacy Settings</Text>
                <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
              </button>
            </div>
          </section>

          {/* Notifications Section */}
          <section>
            <Title size="base" weight="600" className="mb-4">Notifications</Title>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 py-4 flex justify-between items-center border-b border-gray-100">
                <div>
                  <Text size="base" weight="500">Push Notifications</Text>
                  <Text size="sm" color="#B0B0B0" className="mt-1">Receive workout reminders</Text>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    notifications ? "bg-[#308FAB]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      notifications ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="px-4 py-4 flex justify-between items-center">
                <div>
                  <Text size="base" weight="500">Email Updates</Text>
                  <Text size="sm" color="#B0B0B0" className="mt-1">Get weekly progress reports</Text>
                </div>
                <button
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    emailUpdates ? "bg-[#308FAB]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      emailUpdates ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Subscription Section */}
          <section>
            <Title size="base" weight="600" className="mb-4">Subscription</Title>
            <div className="bg-white rounded-lg shadow-sm">
              <button className="w-full px-4 py-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50">
                <div className="text-left">
                  <Text size="base" weight="500">Current Plan</Text>
                  <Text size="sm" color="#308FAB" weight="600" className="mt-1">Premium Member</Text>
                </div>
                <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
              </button>
              <button className="w-full px-4 py-4 flex justify-between items-center hover:bg-gray-50">
                <Text size="base" weight="500">Billing History</Text>
                <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
              </button>
            </div>
          </section>

          {/* Support Section */}
          <section>
            <Title size="base" weight="600" className="mb-4">Support</Title>
            <div className="bg-white rounded-lg shadow-sm">
              <button className="w-full px-4 py-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50">
                <Text size="base" weight="500">Help Center</Text>
                <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
              </button>
              <button className="w-full px-4 py-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50">
                <Text size="base" weight="500">Contact Support</Text>
                <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
              </button>
              <button className="w-full px-4 py-4 flex justify-between items-center hover:bg-gray-50">
                <Text size="base" weight="500">Terms & Privacy</Text>
                <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="pt-8">
            <Button
              variant="transparent"
              fullWidth
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Delete Account
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
