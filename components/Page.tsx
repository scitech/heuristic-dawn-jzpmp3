import styles from "./Page.module.css";

interface PageProps {
  heading: string;
  children: React.ReactNode;
}
export const Page = ({ heading, children }: PageProps) => {
  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{heading}</h1>
      {children}
    </main>
  );
};
