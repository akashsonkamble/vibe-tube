import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Category = {
    id: number;
    name: string;
};

type CategoryPillProps = {
    categories: Category[];
    selectedCategory: number;
    setSelectedCategory: (categoryId: number) => void;
};

const TRANSLATE_AMOUNT = 200;

const CategoryPills = ({ categories, selectedCategory, setSelectedCategory }: CategoryPillProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [translate, setTranslate] = useState(0);
    const [isLeftVisible, setIsLeftVisible] = useState(false);
    const [isRightVisible, setIsRightVisible] = useState(false);

    useEffect(() => {
        if (containerRef.current === null) return;
        
        const observer = new ResizeObserver(entries => {
            const container = entries[0]?.target as HTMLDivElement;
            
            if (container === null) return;

            setIsLeftVisible(translate > 0);
            setIsRightVisible(
                translate + container.clientWidth < container.scrollWidth
            )
        })
        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
        }
    }, [categories, translate]);

    const leftClickHandler = () => {
        setTranslate(translate => {
            const newTranslate = translate - TRANSLATE_AMOUNT;
            if (newTranslate <= 0) {
                return 0;
            }
            return newTranslate;
        })
    }

    const rightClickHandler = () => {
        setTranslate(translate => {
            if (containerRef.current === null) {
                return translate;
            }
            const newTranslate = translate + TRANSLATE_AMOUNT;
            const edge = containerRef.current.scrollWidth;
            const width = containerRef.current.clientWidth;
            if (newTranslate + width >= edge) {
                return edge - width;
            }
            return newTranslate;
        })
    }

    return (
        <div ref={containerRef} className="overflow-x-hidden relative">
            <div
                className="flex whitespace-nowrap gap-3 transition-transform w-[max-content]" 
                style={{ transform: `translateX(-${translate}px)` }}
            >
                {categories.map(({ id, name }) => (
                    <Button
                        key={id}
                        onClick={() => setSelectedCategory(id)}
                        variant={selectedCategory === id ? "dark" : "default"}
                        className="py-1 px-3 rounded-lg whitespace-nowrap"
                    >
                        {name}
                    </Button>
                ))}
            </div>
            {isLeftVisible && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white from-50% to-transparent w-24 h-full">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-full aspect-square w-auto p-1.5"
                    onClick={leftClickHandler}
                >
                    <ChevronLeft />
                </Button>
            </div>
            )}
            {isRightVisible && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white from-50% to-transparent w-24 h-full flex justify-end">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-full aspect-square w-auto p-1.5"
                    onClick={rightClickHandler}
                >
                    <ChevronRight />
                </Button>
            </div>
            )}
        </div>

    )
}

export default CategoryPills;