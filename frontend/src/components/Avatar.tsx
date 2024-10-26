import { useEffect, useRef } from "react"
import "./avatar.css"
import { useAuthContext } from "../context/AuthContext"

interface AvatarProps {
    arrows: true | false
    colorXY?: number[]
    eyesXY?: number[]
    mouthXY?: number[]
}

const Avatar = ({ arrows=false, colorXY=[0,0], eyesXY= [0,0], mouthXY=[0,0] }: AvatarProps) => {

    const eyesRef = useRef<HTMLDivElement | null>(null)
    const mouthRef = useRef<HTMLDivElement | null>(null)
    const colorRef = useRef<HTMLDivElement | null>(null)
    const leftArrowRef1 = useRef<HTMLDivElement | null>(null)
    const leftArrowRef2 = useRef<HTMLDivElement | null>(null)
    const leftArrowRef3 = useRef<HTMLDivElement | null>(null)
    const rightArrowRef1 = useRef<HTMLDivElement | null>(null)
    const rightArrowRef2 = useRef<HTMLDivElement | null>(null)
    const rightArrowRef3 = useRef<HTMLDivElement | null>(null)

    const {authUser,setAuthUser} = useAuthContext()

    useEffect(()=>{
        if (colorRef?.current) {
            colorRef.current.style.backgroundPosition = `${colorXY[0]}% ${colorXY[1]}%`;
        }
        if (eyesRef?.current) {
            eyesRef.current.style.backgroundPosition = `${eyesXY[0]}% ${eyesXY[1]}%`;
        }
        if (mouthRef?.current) {
            mouthRef.current.style.backgroundPosition = `${mouthXY[0]}% ${mouthXY[1]}%`;
        }
    },[colorXY,eyesXY,mouthXY])

    const backColor = () => {
        if (!colorRef.current) return
        const style = window.getComputedStyle(colorRef?.current)
        const bgPosition = style.getPropertyValue('background-position')
        const positionArray = bgPosition.split(" ");
        let xPosition = parseFloat(positionArray[0]);
        let yPosition = parseFloat(positionArray[1]);

        if (xPosition === 0 && yPosition === 0) {
            xPosition = -500
            yPosition = -200
        }
        else {
            xPosition += 100;
            if (xPosition > 0) {
                xPosition = -900
                yPosition += 100
                if (yPosition > 0) yPosition = 0
            }
        }
        //@ts-ignore
        setAuthUser({
            ...authUser,
            colorXY: [xPosition,yPosition]
        })

        const newBgPosition = `${xPosition}% ${yPosition}%`;

        if (colorRef?.current) {
            colorRef.current.style.backgroundPosition = newBgPosition;
        }
    }

    const forwardColor = () => {
        if (!colorRef.current) return
        const style = window.getComputedStyle(colorRef?.current)
        const bgPosition = style.getPropertyValue('background-position')
        const positionArray = bgPosition.split(" ");
        let xPosition = parseFloat(positionArray[0]);
        let yPosition = parseFloat(positionArray[1]);

        if (xPosition === -500 && yPosition === -200) {
            xPosition = 0
            yPosition = 0
        }
        else {
            xPosition -= 100;
            if (xPosition < -900) {
                xPosition = 0
                yPosition -= 100
                if (yPosition < -500) yPosition = 0
            }
        }
        //@ts-ignore
        setAuthUser({
            ...authUser,
            colorXY: [xPosition,yPosition]
        })

        const newBgPosition = `${xPosition}% ${yPosition}%`;

        if (colorRef?.current) {
            colorRef.current.style.backgroundPosition = newBgPosition;
        }
    }

    const backMouth = () => {
        if (!mouthRef.current) return
        const style = window.getComputedStyle(mouthRef?.current)
        const bgPosition = style.getPropertyValue('background-position')
        const positionArray = bgPosition.split(" ");
        let xPosition = parseFloat(positionArray[0]);
        let yPosition = parseFloat(positionArray[1]);

        if (xPosition === 0 && yPosition === 0) {
            xPosition = 0
            yPosition = -500
        }
        else {
            xPosition += 100;
            if (xPosition > 0) {
                xPosition = -900
                yPosition += 100
                if (yPosition > 0) yPosition = 0
            }
        }
        //@ts-ignore
        setAuthUser({
            ...authUser,
            mouthXY: [xPosition,yPosition]
        })

        const newBgPosition = `${xPosition}% ${yPosition}%`;

        if (mouthRef?.current) {
            mouthRef.current.style.backgroundPosition = newBgPosition;
        }
    }

    const forwardMouth = () => {
        if (!mouthRef.current) return
        const style = window.getComputedStyle(mouthRef?.current)
        const bgPosition = style.getPropertyValue('background-position')
        const positionArray = bgPosition.split(" ");
        let xPosition = parseFloat(positionArray[0]);
        let yPosition = parseFloat(positionArray[1]);

        if (xPosition === 0 && yPosition === -500) {
            xPosition = 0
            yPosition = 0
        }
        else {
            xPosition -= 100;
            if (xPosition < -900) {
                xPosition = 0
                yPosition -= 100
                if (yPosition < -500) yPosition = 0
            }
        }
        //@ts-ignore
        setAuthUser({
            ...authUser,
            mouthXY: [xPosition,yPosition]
        })

        const newBgPosition = `${xPosition}% ${yPosition}%`;

        if (mouthRef?.current) {
            mouthRef.current.style.backgroundPosition = newBgPosition;
        }
    }

    const backEyes = () => {
        if (!eyesRef.current) return
        const style = window.getComputedStyle(eyesRef?.current)
        const bgPosition = style.getPropertyValue('background-position')
        const positionArray = bgPosition.split(" ");
        let xPosition = parseFloat(positionArray[0]);
        let yPosition = parseFloat(positionArray[1]);

        if (xPosition === 0 && yPosition === 0) {
            xPosition = -600
            yPosition = -500
        }
        else {
            xPosition += 100;
            if (xPosition > 0) {
                xPosition = -900
                yPosition += 100
                if (yPosition > 0) yPosition = 0
            }
        }
        //@ts-ignore
        setAuthUser({
            ...authUser,
            eyesXY: [xPosition,yPosition]
        })

        const newBgPosition = `${xPosition}% ${yPosition}%`;

        if (eyesRef?.current) {
            eyesRef.current.style.backgroundPosition = newBgPosition;
        }
    }

    const forwardEyes = () => {
        if (!eyesRef.current) return
        const style = window.getComputedStyle(eyesRef?.current)
        const bgPosition = style.getPropertyValue('background-position')
        const positionArray = bgPosition.split(" ");
        let xPosition = parseFloat(positionArray[0]);
        let yPosition = parseFloat(positionArray[1]);

        if (xPosition === -600 && yPosition === -500) {
            xPosition = 0
            yPosition = 0
        }
        else {
            xPosition -= 100;
            if (xPosition < -900) {
                xPosition = 0
                yPosition -= 100
                if (yPosition < -500) yPosition = 0
            }
        }
        //@ts-ignore
        setAuthUser({
            ...authUser,
            eyesXY: [xPosition,yPosition]
        })

        const newBgPosition = `${xPosition}% ${yPosition}%`;

        if (eyesRef?.current) {
            eyesRef.current.style.backgroundPosition = newBgPosition;
        }
    }

    const leftMouseOver = (ref: HTMLDivElement | null) => {
        if (ref) {
            ref.style.backgroundPosition = "-100% 0%";
        }
    }

    const leftMouseOut = (ref: HTMLDivElement | null) => {
        if (ref) {
            ref.style.backgroundPosition = "0% 0%";
        }
    }

    const rightMouseOver = (ref: HTMLDivElement | null) => {
        if (ref) {
            ref.style.backgroundPosition = "-100% -100%";
        }
    }

    const rightMouseOut = (ref: HTMLDivElement | null) => {
        if (ref) {
            ref.style.backgroundPosition = "0% -100%";
        }
    }

    return (
        <>
            {arrows && <div className="h-[80%] aspect-[1/2] flex flex-col">
                <div
                    onClick={backEyes}
                    ref={leftArrowRef1}
                    onMouseOver={() => leftMouseOver(leftArrowRef1.current)}
                    onMouseOut={() => leftMouseOut(leftArrowRef1.current)}
                    className="bg-arrow bg-repeat arrow-left h-1/3 w-full cursor-pointer" />
                <div
                    onClick={backMouth}
                    ref={leftArrowRef2}
                    onMouseOver={() => leftMouseOver(leftArrowRef2.current)}
                    onMouseOut={() => leftMouseOut(leftArrowRef2.current)}
                    className="bg-arrow bg-repeat arrow-left h-1/3 w-full cursor-pointer" />
                <div
                    onClick={backColor}
                    ref={leftArrowRef3}
                    onMouseOver={() => leftMouseOver(leftArrowRef3.current)}
                    onMouseOut={() => leftMouseOut(leftArrowRef3.current)}
                    className="bg-arrow bg-repeat arrow-left h-1/3 w-full cursor-pointer" />
            </div>}
            <div className="h-full aspect-square flex items-center justify-center relative">
                <div ref={colorRef} className="bg-avatar-color w-full h-full bg-repeat avatar-color absolute" />
                <div ref={eyesRef} className="bg-avatar-eyes w-full h-full bg-repeat avatar-eyes absolute" />
                <div ref={mouthRef} className="bg-avatar-mouth w-full h-full bg-repeat avatar-mouth absolute" />
            </div>
            {arrows && <div className="h-[80%] aspect-[1/2]">
                <div
                    onClick={forwardEyes}
                    ref={rightArrowRef1}
                    onMouseOver={() => rightMouseOver(rightArrowRef1.current)}
                    onMouseOut={() => rightMouseOut(rightArrowRef1.current)}
                    className="bg-arrow bg-repeat arrow-right h-1/3 w-full cursor-pointer" />
                <div 
                    onClick={forwardMouth}
                    ref={rightArrowRef2}
                    onMouseOver={() => rightMouseOver(rightArrowRef2.current)}
                    onMouseOut={() => rightMouseOut(rightArrowRef2.current)}
                    className="bg-arrow bg-repeat arrow-right h-1/3 w-full cursor-pointer" />
                <div 
                    onClick={forwardColor}
                    ref={rightArrowRef3}
                    onMouseOver={() => rightMouseOver(rightArrowRef3.current)}
                    onMouseOut={() => rightMouseOut(rightArrowRef3.current)}
                    className="bg-arrow bg-repeat arrow-right h-1/3 w-full cursor-pointer" />
            </div>}
        </>
    )
}

export default Avatar