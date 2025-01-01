import { Button } from '@repo/ui/components/button'

export default function Page(): JSX.Element {
  return (
    <div className='w-screen h-screen bg-background text-primary-foreground'>
      {/* <div className='w-[200px] h-[200px] bg-primary'></div> */}

      <Button>Hey</Button>
    </div>
  )
}
