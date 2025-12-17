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
  spots?: number;
}

// Mock classes data
const mockClasses: Record<string, BookingClass[]> = {
  default: [
    { id: "1", title: "Abs Blast", subtitle: "Strength", duration: "45m", time: "09:00", type: "remote", joined: false, spots: 12 },
    { id: "2", title: "Full Body Weighted", subtitle: "Strength", duration: "45m", time: "11:00", type: "remote", joined: true, spots: 8 },
    { id: "3", title: "HIIT Cardio", subtitle: "Cardio", duration: "30m", time: "14:00", type: "remote", joined: false, spots: 15 },
    { id: "4", title: "Yoga Flow", subtitle: "Yoga", duration: "60m", time: "17:00", type: "remote", joined: false, spots: 10 },
    { id: "5", title: "Personal Training", subtitle: "1-on-1 Session", duration: "60m", time: "19:00", type: "one_to_one", joined: true, noCover: true, spots: 1 },
  ],
};

export default function BookPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [joinedClasses, setJoinedClasses] = useState<Set<string>>(new Set(["2", "5"]));

  // Get classes for selected date (using mock data)
  const getClassesForDate = () => {
    return mockClasses.default.map((cls) => ({
      ...cls,
      joined: joinedClasses.has(cls.id),
    }));
  };

  const classes = getClassesForDate();

  // Toggle class join status
  const toggleJoin = (classId: string) => {
    setJoinedClasses((prev) => {
      const next = new Set(prev);
      if (next.has(classId)) {
        next.delete(classId);
      } else {
        next.add(classId);
      }
      return next;
    });
  };

  // Generate week dates
  const getWeekDates = () => {
    const start = new Date(selectedDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Start from Monday
    start.setDate(diff);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  // Generate month dates
  const getMonthDates = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday start
    const dates: (Date | null)[] = [];
    
    // Padding for days before month starts
    for (let i = 0; i < startPad; i++) dates.push(null);
    
    // Days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month, i));
    }
    
    return dates;
  };

  const weekDates = getWeekDates();
  const monthDates = getMonthDates();
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const isSelected = (date: Date | null) => date?.toDateString() === selectedDate.toDateString();
  const isToday = (date: Date | null) => date?.toDateString() === new Date().toDateString();

  const navigatePrev = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const goToday = () => setSelectedDate(new Date());

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
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-6 py-2 rounded-full text-base font-semibold transition-colors ${
                viewMode === "month"
                  ? "bg-[#308FAB]/20 text-[#308FAB]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Month
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <Image src="/icons/tune.svg" alt="Filters" width={16} height={16} />
            <Text size="base" weight="600" noWrap>
              Filters
            </Text>
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {/* Month/Year Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={navigatePrev}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Image src="/icons/back.svg" alt="Previous" width={20} height={20} />
            </button>
            <div className="flex items-center gap-4">
              <Title size="base" weight="600">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Title>
              <button
                onClick={goToday}
                className="px-3 py-1 text-sm font-semibold bg-gray-100 rounded-full hover:bg-gray-200 transition"
              >
                Today
              </button>
            </div>
            <button
              onClick={navigateNext}
              className="p-2 hover:bg-gray-100 rounded-full transition"
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
          {viewMode === "week" && (
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    isSelected(date)
                      ? "bg-gradient-to-br from-[#429FBA] to-[#217E9A] text-white shadow-md"
                      : isToday(date)
                      ? "bg-[#308FAB]/10 text-gray-800"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <Text
                    size="xs"
                    weight="600"
                    className={isSelected(date) ? "text-white/80" : "text-gray-400"}
                  >
                    {dayNames[idx]}
                  </Text>
                  <Title
                    size="lg"
                    weight="700"
                    className={`mt-1 ${isSelected(date) ? "text-white" : ""}`}
                  >
                    {date.getDate()}
                  </Title>
                  {isToday(date) && !isSelected(date) && (
                    <div className="w-1.5 h-1.5 bg-[#308FAB] rounded-full mt-1" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Month View */}
          {viewMode === "month" && (
            <div>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center py-2">
                    <Text size="xs" weight="600" color="#999">
                      {day}
                    </Text>
                  </div>
                ))}
              </div>
              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {monthDates.map((date, idx) => (
                  <button
                    key={idx}
                    onClick={() => date && setSelectedDate(date)}
                    disabled={!date}
                    className={`aspect-square flex items-center justify-center rounded-lg transition-all ${
                      !date
                        ? "cursor-default"
                        : isSelected(date)
                        ? "bg-gradient-to-br from-[#429FBA] to-[#217E9A] text-white shadow-md"
                        : isToday(date)
                        ? "bg-[#308FAB]/10 text-gray-800 font-bold"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {date && (
                      <span className={`text-sm ${isSelected(date) ? "font-bold" : ""}`}>
                        {date.getDate()}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Date Title */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Title size="base" weight="600">
            {formatDate(selectedDate)}
          </Title>
          <Text size="sm" color="#666">
            {classes.length} classes
          </Text>
        </div>

        {/* Class Cards */}
        <div className="space-y-4">
          {classes.map((cls) => (
            <div key={cls.id} className="flex gap-4 items-start">
              {/* Time */}
              <div className="flex-shrink-0 w-16 pt-4">
                <Title size="lg" weight="600" color="#333">
                  {cls.time}
                </Title>
              </div>

              {/* Card */}
              <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex min-h-[140px] hover:shadow-md transition">
                {/* Cover Image */}
                {!cls.noCover && (
                  <div
                    className="w-28 flex-shrink-0 bg-cover bg-center bg-gray-200"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  />
                )}

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  {/* Header */}
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Title color="#429FBA" size="base" weight="600">
                        {cls.title}
                      </Title>
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                        <Image
                          src={
                            cls.type === "one_to_one"
                              ? "/icons/one-to-one.svg"
                              : "/icons/remote.svg"
                          }
                          alt={cls.type}
                          width={14}
                          height={14}
                        />
                        <Text size="xs" weight="500">
                          {cls.type === "one_to_one" ? "1:1" : "Live"}
                        </Text>
                      </div>
                    </div>
                    <Text size="sm" color="#636363" className="mb-2">
                      {cls.subtitle}
                    </Text>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Image src="/icons/clock.svg" alt="Duration" width={14} height={14} />
                        <Text size="sm" color="#666">{cls.duration}</Text>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/eye.svg" alt="Spots" width={14} height={14} />
                        <Text size="sm" color="#666">{cls.spots} spots</Text>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end items-center mt-3">
                    <Button
                      variant={cls.joined ? "transparent" : "primary"}
                      size="small"
                      className="text-xs uppercase tracking-wide"
                      onClick={() => toggleJoin(cls.id)}
                    >
                      {cls.joined ? "CANCEL" : "BOOK NOW"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {classes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Image src="/icons/calendar-add.svg" alt="No classes" width={28} height={28} className="opacity-50" />
              </div>
              <Title size="lg" className="mb-2 text-gray-600">No classes available</Title>
              <Text size="base" color="#B0B0B0">
                Check back later or select a different date
              </Text>
            </div>
          )}
        </div>

        {/* Book Appointment CTA */}
        <div className="mt-8 p-6 bg-gradient-to-br from-[#429FBA]/10 to-[#217E9A]/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <Title size="lg" weight="600" className="mb-1">
                Book a Personal Session
              </Title>
              <Text size="sm" color="#666">
                Get 1-on-1 training with your coach
              </Text>
            </div>
            <Button variant="primary" size="default">
              SCHEDULE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
