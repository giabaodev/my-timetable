'use client';

import { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarHeader } from '@/app/(main)/calendar/_components/calendar-header';
import { DayView } from '@/app/(main)/calendar/_components/day-view';
import { WeekView } from '@/app/(main)/calendar/_components/week-view';
import { MonthView } from '@/app/(main)/calendar/_components/month-view';
import { AddEventModal } from '@/components/modals/add-event-modal';
import { EventDetailSheet } from '@/components/modals/event-detail-sheet';
import { MiniCalendar } from '@/components/sidebar/mini-calendar';
import { CategoryLegend } from '@/components/sidebar/category-legend';
import { UserMenu } from '@/components/auth/user-menu';
import { useEvents } from '@/hooks/useEvents';
import { useCalendar } from '@/hooks/useCalendar';
import { useAuth } from '@/hooks/useAuth';
import {
  CALENDAR_VIEWS,
  ViewMode,
  type ScheduleEvent,
} from '@/constants/calendar';

export default function CalendarPage() {
  const { session } = useAuth();
  const {
    events,
    isLoaded,
    addEvent,
    deleteEvent,
    deleteOccurrence,
    deleteThisAndFuture,
  } = useEvents(session?.userId);

  const {
    currentDate,
    view,
    setView,
    goToday,
    goNext,
    goPrev,
    goToDate,
    getTitle,
  } = useCalendar();

  // Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addDefaults, setAddDefaults] = useState<{
    date?: string;
    time?: string;
  }>({});
  const [detailEvent, setDetailEvent] = useState<ScheduleEvent | null>(null);
  const [detailDate, setDetailDate] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleSlotClick = useCallback((date: string, time: string) => {
    setAddDefaults({ date, time });
    setAddModalOpen(true);
  }, []);

  const handleDateClick = useCallback((date: string) => {
    setAddDefaults({ date });
    setAddModalOpen(true);
  }, []);

  const handleEventClick = useCallback((event: ScheduleEvent, date: string) => {
    setDetailEvent(event);
    setDetailDate(date);
    setDetailOpen(true);
  }, []);

  const handleFabClick = useCallback(() => {
    setAddDefaults({ date: format(currentDate, 'yyyy-MM-dd') });
    setAddModalOpen(true);
  }, [currentDate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleFabClick();
      }
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        goToday();
      }
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [handleFabClick, goToday]);

  // Loading skeleton
  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="space-y-3 text-center">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-8 w-48 bg-accent rounded-lg" />
            <div className="h-4 w-32 bg-accent rounded" />
            <div className="grid grid-cols-7 gap-2 mt-4">
              {'abcdefghijklmnopqrstu'.split('').map((c) => (
                <div key={c} className="size-8 bg-accent rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      {/* Desktop/Tablet Header */}
      <div className="hidden sm:block">
        <CalendarHeader
          title={getTitle()}
          view={view}
          onViewChange={setView}
          onPrev={goPrev}
          onNext={goNext}
          onToday={goToday}
        />
      </div>

      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-border">
        <h1 className="text-base font-semibold text-foreground">
          {getTitle()}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={goToday}
            className="text-[10px]"
          >
            Today
          </Button>
          <UserMenu />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-background shrink-0">
          <div className="p-3">
            <Button
              onClick={handleFabClick}
              className="w-full bg-primary text-white hover:bg-primary-hover gap-2 rounded-xl shadow-sm hover:shadow-md transition-all"
              size="lg"
            >
              <Plus className="size-4" />
              Add Event
            </Button>
          </div>

          <MiniCalendar selectedDate={currentDate} onDateSelect={goToDate} />

          <Separator className="bg-border" />

          <CategoryLegend />

          <div className="mt-auto p-3">
            <p className="text-[10px] text-muted-foreground/60 text-center">
              Press{' '}
              <kbd className="px-1 py-0.5 bg-accent rounded text-[9px] font-mono">
                N
              </kbd>{' '}
              for new event
              {' · '}
              <kbd className="px-1 py-0.5 bg-accent rounded text-[9px] font-mono">
                T
              </kbd>{' '}
              for today
            </p>
          </div>
        </aside>

        {/* Main Calendar Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {view === ViewMode.DAY && (
            <DayView
              date={currentDate}
              events={events}
              onSlotClick={handleSlotClick}
              onEventClick={handleEventClick}
            />
          )}
          {view === ViewMode.WEEK && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onSlotClick={handleSlotClick}
              onEventClick={handleEventClick}
            />
          )}
          {view === ViewMode.MONTH && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}

          {/* Empty state when no events */}
          {events.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-2 opacity-50">
                <div className="text-4xl">📭</div>
                <p className="text-sm text-muted-foreground">No events here~</p>
                <p className="text-xs text-muted-foreground/70">
                  Click anywhere or press N to add one
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="sm:hidden flex items-center justify-around border-t border-border bg-background py-2 px-4 shrink-0">
        {CALENDAR_VIEWS.map((v) => (
          <Button
            key={v.value}
            onClick={() => setView(v.value)}
            variant="ghost"
            className={`gap-0.5 px-3 py-1 transition-colors ${
              view === v.value
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-[10px] font-medium">{v.label}</span>
          </Button>
        ))}
        <Button
          onClick={handleFabClick}
          className="flex size-10 rounded-full bg-primary text-white shadow-md hover:bg-primary-hover active:scale-95"
          aria-label="Add event"
        >
          <Plus className="size-5" />
        </Button>
      </nav>

      {/* FAB for tablet */}
      <Button
        onClick={handleFabClick}
        className="hidden sm:flex lg:hidden fixed bottom-6 right-6 size-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-hover hover:shadow-xl hover:scale-105 active:scale-95 z-50"
        aria-label="Add event"
      >
        <Plus className="size-6" />
      </Button>

      {/* Modals */}
      <AddEventModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSave={addEvent}
        defaultDate={addDefaults.date}
        defaultTime={addDefaults.time}
      />

      <EventDetailSheet
        event={detailEvent}
        occurrenceDate={detailDate}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={deleteEvent}
        onDeleteOccurrence={deleteOccurrence}
        onDeleteThisAndFuture={deleteThisAndFuture}
      />
    </div>
  );
}
