// Invariant can help with lines that may initially be too long to process
import invariant from "tiny-invariant";

// These code snippets work on the Supabase Postgresql database
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createUser(email: string, password: string) {
    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) return null;

    const profile = await getProfileByEmail(user?.email);

    return profile;
}

export async function getProfileById(id: string) {
    const { data, error } = await supabase
        .from("profiles")
        .select("email, id")
        .eq("id", id)
        .single();

    if (error) return null;
    if (data) return { id: data.id, email: data.email };
}

export async function getProfileByEmail(email?: string) {
    const { data, error } = await supabase
        .from("profiles")
        .select("email, id")
        .eq("email", email)
        .single();

    if (error) return null;
    if (data) return data;
}

export async function verifyLogin(email: string, password: string) {
const { user, error } = await supabase.auth.signIn({
    email,
    password,
});

if (error) return undefined;
const profile = await getProfileByEmail(user?.email);

return profile;
}

// For the code below to work- you need to create a user and note type. If using the Supabase database- you can switch out Note for anything else you want to create as long as you create the necessary tables and everything that goes with them. 
export async function getNoteListItems({ userId }: { userId: User["id"] }) {
    const { data } = await supabase
      .from("notes")
      .select("id, title")
      .eq("profile_id", userId);
  
    return data;
  }
  
export async function createNote({
title,
body,
userId,
}: Pick<Note, "body" | "title"> & { userId: User["id"] }) {
const { data, error } = await supabase
    .from("notes")
    .insert([{ title, body, profile_id: userId }])
    .single();

if (!error) {
    return data;
}

return null;
}

export async function getNote({
id,
userId,
}: Pick<Note, "id"> & { userId: User["id"] }) {
const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("profile_id", userId)
    .eq("id", id)
    .single();

if (!error) {
    return {
    userId: data.profile_id,
    id: data.id,
    title: data.title,
    body: data.body,
    };
}

return null;
}

export async function updateNote({
id,
userId,
}: Pick<Note, "id"> & { userId: User["id"] }) {
const { data, error } = await supabase
    .from("notes")
    .update({'title': data.title, 'body': body})
    .match({ id, profile_id: userId })
    .single();

if (!error) {
    return {
    userId: data.profile_id,
    id: data.id,
    title: data.title,
    body: data.body,
    };
}

return null;
}

export async function deleteNote({
id,
userId,
}: Pick<Note, "id"> & { userId: User["id"] }) {
const { error } = await supabase
    .from("notes")
    .delete({ returning: "minimal" })
    .match({ id, profile_id: userId });

if (!error) {
    return {};
}

return null;
}
