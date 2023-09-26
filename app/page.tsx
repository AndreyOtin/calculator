'use client'

import {useState} from "react";

const generateNumbers = () => {
    const numbers = ['=', '.'].concat(Array.from({length: 10}, (_, i) => i.toString()));
    const arr = [];

    let j = 2
    let k = 0
    for (let i = 0; i < numbers.length; i++) {
        if (j == 2) {
            arr[i] = numbers[i]
        } else {
            arr[j - k] = numbers[i];
        }

        k++;

        if (k === 3) {
            j += 3
            k = 0
        }
    }

    return arr;
}

const isIncluded = <T extends string[]>(str: string, values: T): str is T[number] => values.includes(str)
const splitBySign = (str: string) => str.split(/[+-]|÷|×/gi);
const splitByDigit = (str: string) => str.split(/\d|\./gi).filter(Boolean);

const Operation = {
    '-': (num: number, num2: number) => num - num2,
    '+': (num: number, num2: number) => num + num2,
    '×': (num: number, num2: number) => num * num2,
    '÷': (num: number, num2: number) => num / num2,

} as const;
const operations = Object.keys(Operation) as [keyof typeof Operation]

const calculateResult = (result: string) => {
    const actions = splitByDigit(result)
    const numbers = splitBySign(result).map(Number)

    return actions.reduce((acc, curr, i) => {
        if (isIncluded(curr, operations)) {
            return Operation[curr](acc, numbers[i + 1])
        }

        return acc
    }, numbers[0])


}

const checkInput = (s: string, el: string) => {
    let res: string;

    if (el === '0') {
        res = s ? s + el : ''
    } else {
        res = s === '0' ? el : s + el
    }


    const values = splitBySign(res)
    const isOneDot = values[values.length - 1].split('').filter(el => el === '.').length > 1;

    if (isOneDot) {
        return s
    }

    return res
}

export default function Home() {
    const numbers = generateNumbers()
    const [input, setInput] = useState('')
    const [isNumber, setIsNumber] = useState(true);

    const handleButtonClick = (el: string) => {
        if (el === '=') {
            if (/\D/.test(input[input.length - 1])) {
                const index = input.split('').findLastIndex(el => !Number.isNaN(+el))

                return setInput(calculateResult(input.slice(0, index + 1)).toString());
            }

            return setInput(calculateResult(input).toString());
        }

        setIsNumber(true)
        setInput((s) => checkInput(s, el))
    }

    return (
        <main className="flex min-h-screen flex-col items-center">
            <div className={'container flex-grow flex justify-center items-center'}>
                <div className={'border border-blue-200 p-2'}>
                    <header className={'text-center space-y-2 mb-2'}>
                        <h1>Calculator</h1>
                        <input
                            value={input}
                            type="text" readOnly className={'w-full bg-zinc-200 p-2 h-[30px]'}/>
                    </header>
                    <div className={'grid grid-cols-2 bg-zinc-200'}>
                        <button
                            onClick={() => {
                                setInput('')
                                setIsNumber(true)
                            }}
                            className={'hover:bg-amber-100 active:scale-105 active:shadow ring-[1px] ring-amber-50'}>C
                        </button>
                        <button
                            onClick={() => {
                                setInput((s) => s.slice(0, s.length - 1))

                                if (/\d/.test(input[input.length - 2])) {
                                    setIsNumber(true)
                                } else {
                                    setIsNumber(false)
                                }
                            }}
                            className={'hover:bg-amber-100 active:scale-105 active:shadow ring-[1px] ring-amber-50'}>BACK
                        </button>
                    </div>
                    <div className={'grid grid-cols-4'}>
                        <div className={'grid grid-cols-3 col-span-3'}>
                            {numbers.reverse().map(el => (
                                <button
                                    onClick={() => handleButtonClick(el)}
                                    className={'hover:bg-amber-100 active:scale-105 active:shadow ring-amber-50 ring-[1px]'}
                                    key={el}>{el}</button>
                            ))}
                        </div>
                        <div className={'col-start-4 grid'}>
                            {operations.map(o => (
                                <button
                                    key={o}
                                    onClick={() => isNumber && setInput((s) => {
                                        setIsNumber(false)
                                        return s + o
                                    })}
                                    className={'hover:bg-amber-100 active:scale-105 active:shadow ring-[1px] ring-amber-50'}>
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
