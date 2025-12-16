"use client";

import { useState } from "react";
import Image from "next/image";
import Title from "../_components/atoms/Title";
import Text from "../_components/atoms/Text";
import Button from "../_components/atoms/Button";

type ViewMode = "week" | "month";

interface BookingClass {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  time: string;
  type: "remote" | "one_to_one";
  joined: boolean;
  noCover?: boolean;
}

export default function BookPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock classes for the selected date
  const classes: BookingClass[] = [
    {
      id: "1",
      title: "Abs Blast",
      subtitle: "Strength",
      duration: "45m",
      time: "20:00",
      type: "remote",
      joined: true,
    },
    {
      id: "2",
      title: "Full Body Weighted",
      subtitle: "Strength",
      duration: "45m",
      time: "21:00",
      type: "remote",
      joined: false,
    },
    {
      id: "3",
      title: "HIIT Cardio",
      subtitle: "Cardio",
      duration: "30m",
      time: "22:00",
      type: "remote",
      joined: false,
    },
    {
      id: "4",
      title: "Personal Training",
      subtitle: "Appointment",
      duration: "60m",
      time: "18:00",
      type: "one_to_one",
      joined: true,
      noCover: true,
    },
  ];

  // Generate week dates
  const getWeekDates = () => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-6">
        {/* View Mode Switcher + Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("week")}
              className={`px-6 py-2 rounded-full text-base font-semibold transition-colors ${
                viewMode === "week"
                  ? "bg-[#308FAB]/20 text-[#308FAB]"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-6 py-2 rounded-full text-base font-semibold transition-colors ${
                viewMode === "month"
                  ? "bg-[#308FAB]/20 text-[#308FAB]"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Month
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Image src="/icons/settings.svg" alt="Filters" width={16} height={16} />
            <Text size="base" weight="600" noWrap>
              More Filters
            </Text>
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {/* Month/Year Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                const prev = new Date(selectedDate);
                prev.setDate(prev.getDate() - 7);
                setSelectedDate(prev);
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Image src="/icons/back.svg" alt="Previous" width={20} height={20} />
            </button>
            <Title size="base" weight="600">
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Title>
            <button
              onClick={() => {
                const next = new Date(selectedDate);
                next.setDate(next.getDate() + 7);
                setSelectedDate(next);
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Image
                src="/icons/back.svg"
                alt="Next"
                width={20}
                height={20}
                className="rotate-180"
              />
            </button>
          </div>

          {/* Week View */}
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, idx) => {
              const isSelected =
                date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    isSelected
                      ? "bg-gradient-to-br from-[#429FBA] to-[#217E9A] text-white shadow-md"
                      : isToday
                      ? "bg-gray-100 text-gray-800"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <Text
                    size="xs"
                    weight="600"
                    className={isSelected ? "text-white" : ""}
                  >
                    {dayNames[idx]}
                  </Text>
                  <Title
                    size="lg"
                    weight="700"
                    className={`mt-1 ${isSelected ? "text-white" : ""}`}
                  >
                    {date.getDate()}
                  </Title>
                  {isToday && !isSelected && (
                    <div className="w-1 h-1 bg-[#308FAB] rounded-full mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Title */}
        <Title size="base" weight="600" className="mb-4 ml-4">
          {formatDate(selectedDate)}
        </Title>

        {/* Class Cards */}
        <div className="space-y-4">
          {classes.map((cls) => (
            <div key={cls.id} className="flex gap-4 items-start">
              {/* Time */}
              <div className="flex-shrink-0 w-16 pt-2">
                <Title size="lg" weight="600">
                  {cls.time}
                </Title>
              </div>

              {/* Card */}
              <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex h-36">
                {/* Cover Image */}
                {!cls.noCover && (
                  <div
                    className="w-24 flex-shrink-0 bg-cover bg-center"
                    style={{
                      backgroundImage: "url(/backgrounds/main_bg.png)",
                    }}
                  />
                )}

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  {/* Header */}
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Title color="#429FBA" size="base" weight="500">
                        {cls.title}
                      </Title>
                      <Image
                        src={
                          cls.type === "one_to_one"
                            ? "/icons/one-to-one.svg"
                            : "/icons/remote.svg"
                        }
                        alt={cls.type}
                        width={20}
                        height={20}
                      />
                    </div>
                    <Title color="#636363" size="base" weight="500" className="mb-2">
                      {cls.subtitle}
                    </Title>
                    <div className="flex items-center gap-2">
                      <Image src="/icons/clock.svg" alt="Duration" width={14} height={14} />
                      <Text size="sm">{cls.duration}</Text>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Image src="/icons/eye.svg" alt="People" width={16} height={16} />
                      <Text size="xs" weight="600" color="#308FAB">
                        12
                      </Text>
                    </div>
                    <Button
                      variant={cls.joined ? "transparent" : "primary"}
                      size="small"
                      className="text-[0.7rem] uppercase tracking-wide"
                    >
                      {cls.joined ? "JOINED" : "COUNT ME IN"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {classes.length === 0 && (
            <div className="text-center py-12">
              <Text size="base" color="#B0B0B0">
                No classes scheduled for this day
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
