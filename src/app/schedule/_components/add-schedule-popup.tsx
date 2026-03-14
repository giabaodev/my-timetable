import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Fragment, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Flex } from '@/components/flex';
import { InputDatePicker } from '@/components/input-date-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Schedule, ScheduleData } from '@/schemas/schedule';
import { SelectItem as SelectItemType } from '@/types';

import { REPEAT_SCHEDULE } from './constants/repeat-schedule';
import { DEFAULT_VALUES } from './constants/schedule';

const date = new Date();

export const AddSchedulePopup = () => {
  const { control, handleSubmit } = useForm<ScheduleData>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(Schedule),
  });
  const anchor = useComboboxAnchor();
  const [endTime, setEndTime] = useState<string>('09:00');
  const [endDate, setEndDate] = useState<string>(format(date, 'yyyy-MM-dd'));

  // function handleSubmit() {
  //   if (!onAddSchedule) {
  //     return;
  //   }
  //   onAddSchedule({
  //     subjectName: subjectName.trim(),
  //     teacherName: teacherName.trim(),
  //     startTime,
  //     startDate,
  //     endTime,
  //     endDate,
  //   });
  //   setSubjectName('');
  //   setTeacherName('');
  //   setStartTime('08:00');
  //   setEndTime('09:00');
  //   setStartDate(format(date, 'yyyy-MM-dd'));
  //   setEndDate(format(date, 'yyyy-MM-dd'));
  //   setRepeat(true);
  //   setRepeatDays(['monday']);
  // }

  const onSubmit: SubmitHandler<ScheduleData> = (data) => {
    console.log(data);
  };

  return (
    <form id="form-add-schedule" onSubmit={handleSubmit(onSubmit)}>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full ml-auto"
            aria-label="Add schedule"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Controller
                control={control}
                name="subjectName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-subject-name">Subject Name</FieldLabel>
                    <Input
                      {...field}
                      id="form-subject-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Mathematics"
                      autoComplete="off"
                    />
                  </Field>
                )}
              />
            </div>
            <div className="space-y-1">
              <Controller
                control={control}
                name="teacherName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-teacher-name">Teacher Name</FieldLabel>
                    <Input
                      {...field}
                      id="form-teacher-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Mr. Anderson"
                      autoComplete="off"
                    />
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <Controller
                control={control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-start-time" className="text-xs font-medium">
                      Start time
                    </FieldLabel>
                    <Input {...field} id="form-start-time" type="time" />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="startDate"
                render={({ field: { value, onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-start-date" className="text-xs font-medium">
                      Start day
                    </FieldLabel>
                    <InputDatePicker
                      {...field}
                      id="form-start-day"
                      value={new Date(value)}
                      onChange={onChange}
                    />
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <Controller
                control={control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-end-time" className="text-xs font-medium">
                      End time
                    </FieldLabel>
                    <Input {...field} id="form-end-time" type="time" />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="endDate"
                render={({ field: { value, onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-end-date" className="text-xs font-medium">
                      End day
                    </FieldLabel>
                    <InputDatePicker
                      {...field}
                      id="form-end-date"
                      value={new Date(value)}
                      onChange={onChange}
                    />
                  </Field>
                )}
              />
            </div>
            <Flex direction="col" className="gap-3">
              <Label htmlFor="repeat">Repeat (if the schedule occurs more than once)</Label>
              <Flex direction="col" className="space-y-2">
                <Controller
                  control={control}
                  name="dayRepeat"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-4">
                      <Flex className="col-span-1 items-center space-x-1">
                        <Checkbox />
                        <FieldLabel htmlFor="form-day-repeat">Day</FieldLabel>
                      </Flex>
                      <Combobox
                        {...field}
                        id="form-day-repeat"
                        multiple
                        items={REPEAT_SCHEDULE}
                        onValueChange={(values) => {
                          console.log(values);
                        }}
                        autoHighlight
                      >
                        <ComboboxChips ref={anchor} className="w-full col-span-3">
                          <ComboboxValue>
                            {(values) => (
                              <Fragment>
                                {values.map((value: string) => (
                                  <ComboboxChip key={value}>{value}</ComboboxChip>
                                ))}
                              </Fragment>
                            )}
                          </ComboboxValue>
                          <ComboboxChipsInput placeholder="Select a framework" />
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                          <ComboboxItem value="every-day">Every day</ComboboxItem>
                          <ComboboxSeparator />
                          <ComboboxList>
                            {(day: SelectItemType) => (
                              <ComboboxItem key={day.value} value={day}>
                                {day.label}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="dayRepeat"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-4">
                      <Flex className="col-span-1 items-center space-x-1">
                        <Checkbox />
                        <FieldLabel htmlFor="form-week-repeat">Week</FieldLabel>
                      </Flex>
                      <Combobox
                        {...field}
                        id="form-week-repeat"
                        multiple
                        items={REPEAT_SCHEDULE}
                        onValueChange={(values) => {
                          console.log(values);
                        }}
                        autoHighlight
                      >
                        <ComboboxChips ref={anchor} className="w-full col-span-3">
                          <ComboboxValue>
                            {(values) => (
                              <Fragment>
                                {values.map((value: string) => (
                                  <ComboboxChip key={value}>{value}</ComboboxChip>
                                ))}
                              </Fragment>
                            )}
                          </ComboboxValue>
                          <ComboboxChipsInput placeholder="Select a framework" />
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                          <ComboboxItem value="every-day">Every day</ComboboxItem>
                          <ComboboxSeparator />
                          <ComboboxList>
                            {(day: SelectItemType) => (
                              <ComboboxItem key={day.value} value={day}>
                                {day.label}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="dayRepeat"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-4">
                      <Flex className="col-span-1 items-center space-x-1">
                        <Checkbox />
                        <FieldLabel htmlFor="form-month-repeat">Month</FieldLabel>
                      </Flex>
                      <Combobox
                        {...field}
                        id="form-month-repeat"
                        multiple
                        items={REPEAT_SCHEDULE}
                        onValueChange={(values) => {
                          console.log(values);
                        }}
                        autoHighlight
                      >
                        <ComboboxChips ref={anchor} className="w-full col-span-3">
                          <ComboboxValue>
                            {(values) => (
                              <Fragment>
                                {values.map((value: string) => (
                                  <ComboboxChip key={value}>{value}</ComboboxChip>
                                ))}
                              </Fragment>
                            )}
                          </ComboboxValue>
                          <ComboboxChipsInput placeholder="Select a framework" />
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                          <ComboboxItem value="every-day">Every day</ComboboxItem>
                          <ComboboxSeparator />
                          <ComboboxList>
                            {(day: SelectItemType) => (
                              <ComboboxItem key={day.value} value={day}>
                                {day.label}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </Field>
                  )}
                />
              </Flex>
            </Flex>
          </div>
          <DialogFooter>
            <Button type="submit" form="form-add-schedule">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};
