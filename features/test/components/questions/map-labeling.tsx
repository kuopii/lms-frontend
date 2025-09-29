import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import PointsField from "@/features/test/components/points-field";
import QuestionBreakdown from "@/features/test/components/question-breakdown";
import QuestionHeader from "@/features/test/components/question-header";
import { indexToLetter } from "@/helpers/index-to-letter";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa6";
import { PiCopyFill } from "react-icons/pi";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { ImageDropzone } from "../../listening/components/image-dropzone";

interface MapLabelingProps {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  globalNumber: number;
  canRemove: boolean;
}

enum ValueOption {
  ALPHABET = "alphabet",
  NUMBER = "number",
  COSTUME = "costume",
}

const OPTION_KEYS = [
  { name: "Alphabet", value: ValueOption.ALPHABET },
  { name: "Number", value: ValueOption.NUMBER },
  { name: "Custom", value: ValueOption.COSTUME },
];

const generateOptionKey = (index: number, type: ValueOption): string => {
  switch (type) {
    case ValueOption.ALPHABET:
      return indexToLetter(index);
    case ValueOption.NUMBER:
      return (index + 1).toString();
    case ValueOption.COSTUME:
      return ""; // Empty for custom input
    default:
      return "";
  }
};

const createNewItem = (questionNumber: number, optionKey = "") => ({
  question_number: questionNumber,
  correct_answer: { option_key: optionKey, option_text: "" },
});

const MapLabeling = ({
  globalNumber,
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
  canRemove,
}: MapLabelingProps) => {
  const { control, watch, setValue } = useFormContext();
  const [optionKeyType, setOptionKeyType] = useState<ValueOption>(
    ValueOption.ALPHABET,
  );
  const questionPath = `${questionsPath}.${qIndex}`;

  const paths = {
    images: `${questionPath}.question_data.images`,
    items: `${questionPath}.items`,
    questionNumber: `${questionPath}.question_number`,
  };

  const watchQuestionNumber = watch(paths.questionNumber) as number;

  const {
    fields: itemsField,
    remove: removeItem,
    append: appendItem,
  } = useFieldArray({
    control,
    name: paths.items,
  });

  const handleFirstInsertItem = () => {
    const newItem = createNewItem(parseFloat(`${watchQuestionNumber}.1`), "A");
    appendItem(newItem);
  };

  const handleAddItem = () => {
    const newIndex = itemsField.length;
    const newOptionKey = generateOptionKey(newIndex, optionKeyType);
    const newItem = createNewItem(
      parseFloat(`${watchQuestionNumber}.${newIndex + 1}`),
      newOptionKey,
    );
    appendItem(newItem);
  };

  const handleRemoveItem = (index: number) => {
    removeItem(index);
  };

  const handleOptionKeyTypeChange = (value: ValueOption) => {
    setOptionKeyType(value);
  };

  const updateOptionKeys = useCallback(() => {
    if (optionKeyType === ValueOption.COSTUME) {
      itemsField.forEach((_, index) =>
        setValue(`${paths.items}.${index}.correct_answer.option_key`, ""),
      );
    } else {
      itemsField.forEach((_, index) => {
        const newKey = generateOptionKey(index, optionKeyType);
        setValue(`${paths.items}.${index}.correct_answer.option_key`, newKey);
      });
    }
  }, [itemsField, optionKeyType, setValue, paths.items]);

  const canRemoveItem = itemsField.length > 1;
  const hasItems = itemsField.length > 0;

  useEffect(() => {
    updateOptionKeys();
  }, [updateOptionKeys]);

  useEffect(() => {
    itemsField.forEach((_, index) => {
      const newItemsQuestionNumber = parseFloat(
        `${watchQuestionNumber}.${index + 1}`,
      );
      setValue(
        `${paths.items}.${index}.question_number`,
        newItemsQuestionNumber,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    });
  }, [itemsField, paths.items, setValue, watchQuestionNumber]);

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="input"
          questionPath={questionPath}
          globalNumber={globalNumber}
          questionPlaceholder="Type the map title here..."
          withNumber={false}
        />

        <div className="flex w-full flex-col items-center justify-center gap-6 rounded-3xl px-4 py-6">
          <ImageDropzone fieldPrefix={`${paths.images}`} showActions={true} />
        </div>

        <Separator />

        <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          {!hasItems ? (
            <Button
              type="button"
              size="xsm"
              variant="outline"
              className="w-full md:w-fit"
              onClick={handleFirstInsertItem}
            >
              <Plus />
              Create Items
            </Button>
          ) : (
            <div className="hidden md:block" />
          )}

          <div className="flex w-full items-center justify-between gap-4 md:w-fit">
            <PointsField questionPath={questionPath} />

            <Button
              type="button"
              size="iconSm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateQuestion?.(qIndex);
              }}
              className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
            >
              <PiCopyFill />
            </Button>

            <Button
              size="iconSm"
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveQuestion?.(qIndex);
              }}
              disabled={!canRemove}
              className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-5"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      </div>

      {hasItems && (
        <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
          {itemsField.map((item, itemIndex) => (
            <div key={item.id} className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-4">
                  <FormField
                    control={control}
                    name={`${paths.items}.${itemIndex}.correct_answer.option_key`}
                    render={({ field }) => (
                      <FormItem className="w-full max-w-16">
                        <FormControl>
                          <Input
                            tabIndex={
                              optionKeyType === ValueOption.COSTUME ? 0 : -1
                            }
                            variant="underline"
                            {...field}
                            readOnly={optionKeyType !== ValueOption.COSTUME}
                            placeholder={
                              optionKeyType === ValueOption.COSTUME ? "Key" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <span>:</span>

                  <FormField
                    control={control}
                    name={`${paths.items}.${itemIndex}.correct_answer.option_text`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            variant="underline"
                            {...field}
                            placeholder="Type the correct answer here..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  tabIndex={-1}
                  onClick={() => handleRemoveItem(itemIndex)}
                  disabled={!canRemoveItem}
                  className="[&_svg:not([class*='size-'])]:size-5"
                >
                  <RiDeleteBack2Fill />
                </Button>
              </div>
            </div>
          ))}

          <Separator />

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex w-full items-center gap-4 md:w-fit">
              <Select
                value={optionKeyType}
                onValueChange={handleOptionKeyTypeChange}
              >
                <SelectTrigger className="w-full data-[size=default]:h-10 md:max-w-72">
                  <SelectValue placeholder="Choose option type" />
                </SelectTrigger>
                <SelectContent>
                  {OPTION_KEYS.map((key) => (
                    <SelectItem key={key.name} value={key.value}>
                      {key.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              size="xsm"
              onClick={handleAddItem}
              className="w-full md:w-fit"
              variant="outline"
            >
              <Plus />
              Add item
            </Button>
          </div>
        </div>
      )}

      <QuestionBreakdown
        breakdownPath={`${questionsPath}.${qIndex}.breakdown`}
      />
    </div>
  );
};

export default MapLabeling;
