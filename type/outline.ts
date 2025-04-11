export interface Outline {
  title: string,
  subtitle: string,
  presenter: string,
  outline: SecondaryOutline[]
}

interface SecondaryOutline {
  title: string,
  describe: string,
  content: Level3Outline[]
}

interface Level3Outline {
  title: string,
  content: Level4Outline[]
}

interface Level4Outline {
  title: string,
  content: string
}